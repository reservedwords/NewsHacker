function findThread(noThreadCallback, oneThreadCallback, multipleThreadCallback, errorCallback) {
    chrome.tabs.query({active: true, currentWindow: true}, arrayOfTabs => {
        let activeTab = arrayOfTabs[0];
        let search = `http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=${activeTab.url}`;

        let x = new XMLHttpRequest();
        x.open('GET', search);
        x.responseType = 'json';
        x.onload = () => {
            let response = x.response;
            if (!response || !response.hits || response.hits.length === 0) {
              noThreadCallback();
            }

            if (response.hits.length == 1) {
                oneThreadCallback(response.hits[0]);
            }
            else {
                let exactMatch = response.hits.find(hit => hit.url == activeTab.url);
                if(exactMatch) {
                    oneThreadCallback(exactMatch);
                }
                else
                {
                    multipleThreadCallback(response.hits)
                }
            }
        };
        x.onerror = errorCallback;
        x.send();
    });
}

function openThreadInNewTab(hit) {
    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`;
    chrome.tabs.create({url: hnThread})        
}

function postEmptyThreadMessage(port){
    postThreadMessage(port)([]);
}

function postThreadMessage(port) {
    return function(hits) {
        port.postMessage({ success: true, threads: hits});
    }
}

function postError(port) {
    return function(err) {
        port.postMessage({success: false, error: err})
    }
}

chrome.extension.onConnect.addListener(function(port) {
    findThread(postEmptyThreadMessage(port), openThreadInNewTab, postThreadMessage(port), postError(port))
});