function findThread(noThreadCallback, oneThreadCallback, multipleThreadCallback, errorCallback) {
    chrome.tabs.query({active: true, currentWindow: true}, arrayOfTabs => {
        if(!arrayOfTabs || arrayOfTabs.length == 0) errorCallback("Cannot detect active tab when devtools is in focus");
        let activeTab = arrayOfTabs[0];
        let search = `http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=${activeTab.url}`;
        
        function handleResponse( response, textStatus, jqXHR ) {
            if (!response || !response.hits || response.hits.length === 0) {
              noThreadCallback();
              return;
            }

            if (response.hits.length == 1) {
                oneThreadCallback(response.hits[0]);
                return;
            }
            let exactMatch = response.hits.find(hit => hit.url == activeTab.url);
            if(exactMatch) {
                oneThreadCallback(exactMatch);
            }
            else
            {
                multipleThreadCallback(response.hits)
            }
        }
        
        $.ajax({
            url: search,
            method: 'GET',
            dataType: 'json'
        })
        .done(handleResponse)
        .fail(function(xhr, status, err) { errorCallback(err); });
    });
}

function openThreadInNewTab(hit) {
    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`;
    chrome.tabs.create({url: hnThread})        
}

function postEmptyThreadMessage(port){
    return function(hits) {
        port.postMessage({ success: true, threads: []});
    }
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