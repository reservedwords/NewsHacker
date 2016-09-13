chrome.browserAction.onClicked.addListener(activeTab => {
    let search = `http://hn.algolia.com/api/v1/search?restrictSearchableAttributes=url&query=${activeTab.url}`;
    
    let x = new XMLHttpRequest();
    x.open('GET', search);
    x.responseType = 'json';
    x.onload = () => {
        let response = x.response;
        if (!response || !response.hits || response.hits.length === 0) {
          throw('No hits found on HN search');
        }

        let bestMatch = 
            response.hits.find(hit => hit.url == activeTab.url) || 
            response.hits.sort(h => h.created_at).reverse()[0];

        let hnThread = `https://news.ycombinator.com/item?id=${bestMatch.objectID}`;
        chrome.tabs.create({ url: hnThread });
    };
    x.onerror = () => { throw('Network error.') };
    x.send();
});