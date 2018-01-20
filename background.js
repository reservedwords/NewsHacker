function findThread(targetUrl, callbacks) {
    function handleResponse(response) {

        if (!response || !response.hits || response.hits.length === 0) {
          callbacks.noThread();
          return;
        }

        if (response.hits.length === 1) {
            callbacks.oneThread(response.hits[0]);
            return;
        }

        const exactMatch = response.hits.find(hit => hit.url === targetUrl);
        if(exactMatch) {
            callbacks.oneThread(exactMatch);
        }
        else
        {
            callbacks.multipleThreads(response.hits)
        }
    }
    
    const targetUrlWithoutScheme = targetUrl.replace(new RegExp('[^:]+://'), '');
    const searchUrl = `http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=${targetUrlWithoutScheme}`;
    
    fetch(searchUrl)
        .then(r => r.json())
        .then(handleResponse)
        .catch(e => callbacks.error(JSON.stringify(e)));
}

function findThreadForActiveTab(callbacks) {
    chrome.tabs.query({active: true, currentWindow: true}, arrayOfTabs => {
        if(!arrayOfTabs || arrayOfTabs.length === 0) {
            callbacks.error('Cannot detect active tab when devtools is in focus');
        }
        const activeTab = arrayOfTabs[0];
        findThread(activeTab.url, callbacks)
    });
}

function openThreadInNewTab(hit) {
    const hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`;
    chrome.tabs.create({url: hnThread})
}

function postEmptyThreadMessage(port){
    return hits => port.postMessage({ success: true, threads: []});
}

function postThreadMessage(port) {
    return hits => port.postMessage({ success: true, threads: hits});
}

function postError(port) {
    return err => port.postMessage({success: false, error: err});
}

chrome.extension.onConnect.addListener(port => {
    const callbacks = {
        noThread: postEmptyThreadMessage(port),
        oneThread: openThreadInNewTab,
        multipleThreads: postThreadMessage(port),
        error: postError(port)
    };
    findThreadForActiveTab(callbacks);
});