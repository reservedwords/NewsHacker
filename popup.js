function makeLink(hit) {
    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`
    return `<li><a href="${hnThread}" target="_blank">${hit.title}</a></li>`
}

function showThreads(threads) {
    if(threads.length == 0) { 
        document.getElementById('no-match').innerHTML='No matches found';
        return;
    }

    let innerHtml = threads
            .map(makeLink)
            .reduce((x, y) => x + y, '');
    document.getElementById('hits').innerHTML=innerHtml;
}

function showError(error) {
    document.getElementById('error').innerHTML = 'Something went wrong';
}

function connect() {
    var port = chrome.extension.connect({name: 'MainChannel'});
    port.onMessage.addListener(function(msg) {
        document.getElementById('loading').style.display = 'none';
        if(msg.success) {
            return showThreads(msg.threads)
        }
        return showError(msg.error)
    });
}

document.addEventListener('DOMContentLoaded', connect);
