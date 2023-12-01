import * as Mark from 'mark.js';

// mark.js
const instance = new Mark(document.querySelector("body"));

// receive message from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('content script received message')
  console.log('request', request)
  console.log('sender', sender)

  instance.unmark();
  instance.mark(request.highlight);
})

