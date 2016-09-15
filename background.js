chrome.browserAction.onClicked.addListener(activeTab => {
    chrome.browserAction.setPopup( { popup: "popup.html" } );
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
                var views = chrome.extension.getViews({type: "popup"});

                let innerHtml = response.hits.map(hit => {
                    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`
                    return `<li><a href="${hnThread}">${hit.title}</a></li>`
                }).reduce((x, y) => x + y, '');
                for (var i = 0; i < views.length; i++) {
                    views[i].document.getElementById('hits').innerHTML=innerHtml;
                }
            }
        }
    };
    x.onerror = () => { throw('Network error.') };
    x.send();
})
