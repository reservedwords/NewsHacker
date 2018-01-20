function makeLink(hit) {
    const listItem = document.createElement('li');
    const hyperlink = document.createElement('a');
    
    hyperlink.setAttribute('href', `https://news.ycombinator.com/item?id=${hit.objectID}`);
    hyperlink.setAttribute('target', '_blank');
    hyperlink.setAttribute('rel', 'noopener noreferrer');
    hyperlink.textContent = hit.title;

    listItem.appendChild(hyperlink);
    return listItem;
}

function show(id) {
    document.getElementById(id).classList.remove('hide');
}

function hide(id) {
    document.getElementById(id).classList.add('hide');
}

function showThreads(threads) {
    if(threads.length == 0) {
        show('no-match');
        return;
    }

    let threadLinks = threads
        .filter(thread => thread.num_comments > 0)
        .map(makeLink);
    threadLinks.forEach(link => {
        document.getElementById('hits').appendChild(link);
    });
}

function showError(error) {
    let errorMessage = 'An unknown error occurred';
    if(error) {
        errorMessage = `Error: ${error}`
    }
    show('error');
    document.getElementById('error').textContent = errorMessage;
}

function connect() {
    show('loading');
    var port = chrome.extension.connect({name: 'MainChannel'});
    port.onMessage.addListener(function(msg) {
        hide('loading');
        if(msg.success) {
            showThreads(msg.threads);
            return;
        }
        showError(msg.error);
        return;
    });
}

document.addEventListener('DOMContentLoaded', () => connect());
