chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if(message.method != 'getHits') return;

    let search = `http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=${activeTab.url}`;

    let x = new XMLHttpRequest();
    x.open('GET', search);
    x.responseType = 'json';
    x.onload = () => {
        let response = x.response;
        if (!response || !response.hits || response.hits.length === 0) {
          throw('No hits found on HN search');
        }

        if (response.hits.length == 1) {
            let hnThread = `https://news.ycombinator.com/item?id=${bestMatch.objectID}`;
            chrome.tabs.create({ url: hnThread });
        }
        else {
            let exactMatch = response.hits.find(hit => hit.url == activeTab.url);
            if(exactMatch) {
                let hnThread = `https://news.ycombinator.com/item?id=${bestMatch.objectID}`;
                chrome.tabs.create({ url: hnThread });
            }
            else {
                sendResponse(response.hits.sort(h => -h.created_at))
            }
        }
    };
    x.onerror = () => { throw('Network error.') };
    x.send();
})
