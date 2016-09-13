# NewsHacker
A chrome extension for finding the Hacker News thread associated with a web page.

## Rationale

This extension lets you backtrack to the Hacker News comment thread to a page without having to find the link again on HN. 

Let's say you have 9000 tabs open, and you come across something you know came from HN, but probably two days ago, and you
want to see the dialog about it without too much fuss. Just click the icon and it'll open a new tab to the comments thread for your page.

If there is no comment thread which matches your page _exactly_, it'll give you the thread for the latest submission where the
URL is a superstring of your URL.

Things it doesn't do yet:

* Notify with a extension 'popup' if there is no match
* Notify if there was a problem (e.g. https://hn.algolia.com/api is down)
* Trim out matches with 0 comments
* Offer options for how to rank 'similar' matches (e.g. if you want the most popular rather than the latest)

## Usage

I haven't made it a proper packaged extension yet, so clone it and install it from the cloned repo as an unpacked extension,
as described at https://developer.chrome.com/extensions/getstarted#unpacked.
