import * as Mark from 'mark.js';

console.log('content script loaded')

// mark.js
const instance = new Mark(document.querySelector("body"));

// receive message from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('content script received message')
  console.log('request', request)
  console.log('sender', sender)

  console.log('highlights', request.highlights)
  console.log('length', request.highlights.length)

  instance.unmark();
  request.highlights.forEach((highlight) => {
    instance.mark(highlight);
  });
});

