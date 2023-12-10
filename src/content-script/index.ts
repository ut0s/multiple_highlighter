import * as Mark from 'mark.js';

console.log('content script loaded')

// mark.js
const instance = new Mark(document.querySelector("body"));

// search result count
let foundCount: number[] = [];

// search result position
let position: number[] = [];


// receive message from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('content script received message')
  // console.log('request', request)
  // console.log('sender', sender)

  // console.log('highlights', request.highlights)
  // console.log('length', request.highlights.length)

  switch (request.type) {
    case "highlight": {
      instance.unmark();
      for (let idx = 0; idx < request.highlights.length; idx++) {
        const highlight = request.highlights[idx];
        instance.mark(highlight, {
          // "element": "mark",
          "className": "multiple-highlighter-" + idx.toString(),
          // "exclude": [],
          "separateWordSearch": false,
          // "accuracy": "partially",
          // "diacritics": true,
          // "synonyms": {},
          // "iframes": false,
          // "iframesTimeout": 5000,
          // "acrossElements": false,
          // "caseSensitive": false,
          // "ignoreJoiners": false,
          // "ignorePunctuation": [],
          // "wildcards": "disabled",
          // "each": function (node) {
          //   // node is the marked DOM element
          // },
          // "filter": function (textNode, foundTerm, totalCounter, counter) {
          // textNode is the text node which contains the found term
          // foundTerm is the found search term
          // totalCounter is a counter indicating the total number of all marks
          //              at the time of the function call
          // counter is a counter indicating the number of marks for the found term
          // },
          // "noMatch": function (term) {
          //   // term is the not found term
          // },
          "done": function (counter: number) {
            foundCount[idx] = counter;
            if (counter !== 0) {
              position[idx] = 0;
            }
          },
          // "debug": true,
          // "log": window.console
        }
        );

        console.table({ foundCount })

        // send search result to sidepanel
        chrome.runtime.sendMessage({
          foundCount: foundCount,
          position: position,
        });

      }
      break;
    }
    case "moveUp":
    case "moveDown": {
      const idx = request.index
      console.log(request.type, idx)
      if (position[idx] === undefined) {
        console.log("init:", idx)
        position[idx] = 0;
      }
      console.log("pos", position[idx])
      const elements = document.querySelectorAll("mark.multiple-highlighter-" + idx.toString());
      // console.log("elements", elements)
      console.log("elements[idx]", elements[idx])
      // TODO: make element visible
      elements[position[idx]].scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });

      position[idx] += foundCount[idx]
      if (request.type === "moveUp") {
        position[idx] += 1
      } else {
        position[idx] -= 1
      }
      position[idx] %= foundCount[idx];

      // update position
      chrome.runtime.sendMessage({
        position: position,
      });
      break;
    }
    case "remove": {
      foundCount = request.foundCount;
      position = request.position;
      break;
    }
    case "clear": {
      foundCount = [];
      position = [];
      break;
    }
    default:
      break;
  }

});
