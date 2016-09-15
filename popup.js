function makeLink(hit) {
    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`
    return `<li><a href="${hnThread}" target="_blank">${hit.title}</a></li>`
}

function showThreads(threads) {
    if(threads.length == 0) { 
        $('#no-match').text('No matches found');
        return;
    }

    let threadLinks = threads
            .map(makeLink)
            .reduce((x, y) => x + y, '');
    $('hits').html(threadLinks);
}

function showError(error) {
    $('error').text('Something went wrong');
}

function connect() {
    var port = chrome.extension.connect({name: 'MainChannel'});
    port.onMessage.addListener(function(msg) {
        $('loading').hide();
        if(msg.success) {
            return showThreads(msg.threads)
        }
        return showError(msg.error)
    });
}

$(connect);
