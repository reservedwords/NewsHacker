function renderHit(hit) {
    let hnThread = `https://news.ycombinator.com/item?id=${hit.objectID}`
    $('hits').append(`<li><a href="${hnThread}">${hit.title}</a></li>`)
}

document.onload = () => {
    chrome.runtime.sendMessage({'method':'getHits'}, response => {
      if(response)
        response.forEach(renderHit)
    })
}
