import Mark from 'mark.js';

// import jquery
import $ from 'jquery';

console.log('content script loaded')

// mark.js
const instance = new Mark(document.body);

// search result count
let foundCount: number[] = [];

// search result position
let position: number[] = [];

// options
let options: any = {};
// read options from storage when content script is loaded
chrome.storage.sync.get(['options'], function (result) {
  console.table(result.options);
  options = result.options
});

// receive message from popup and background
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  sendResponse('content script received message')
  console.log('request type:', request.type)
  // console.log('sender', sender)

  // console.log('highlights', request.highlights)
  // console.log('length', request.highlights.length)

  switch (request.type) {
    case "highlight": {
      console.table(request.highlights);
      instance.unmark();
      for (let idx = 0; idx < request.highlights.length; idx++) {
        const highlight = request.highlights[idx];
        if (options.useRegex === true) {
          console.log("use regex", options.useRegex);
          // Create regex
          var flags = highlight.replace(/.*\/([gimy]*)$/, '$1');
          var pattern = highlight.replace(new RegExp('^/(.*?)/' + flags + '$'), '$1');
          var regex = new RegExp(pattern, flags);

          instance.markRegExp(regex, {
            // "element": "mark",
            "className": "multiple-highlighter-" + idx.toString(),
            // "exclude": [],
            "iframes": options.iframes,
            // "iframesTimeout": 5000,
            "acrossElements": options.acrossElements,
            "done": function (counter: number) {
              foundCount[idx] = counter;
              if (counter !== 0) {
                position[idx] = 0;
              }
            },
            "debug": true,
            // "log": window.console
          }
          );
        } else {
          instance.mark(highlight, {
            // "element": "mark",
            "className": "multiple-highlighter-" + idx.toString(),
            // "exclude": [],
            "separateWordSearch": options.separateWordSearch,
            "accuracy": options.accuracy,
            "diacritics": options.diacritics,
            // "synonyms": {},
            "iframes": options.iframes,
            // "iframesTimeout": 5000,
            "acrossElements": options.acrossElements,
            "caseSensitive": options.caseSensitive,
            "ignoreJoiners": options.ignoreJoiners,
            // "ignorePunctuation": [],
            "wildcards": "disabled",
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
        }
        console.table({ foundCount })

        // send search result to sidepanel
        chrome.runtime.sendMessage({
          foundCount: foundCount,
          position: position,
        });

        // add css
        const color = request.colorPalate[idx];
        $('mark.multiple-highlighter-' + idx).css('background', color);
        console.log("colorPalate", color)
      }
      break;
    }
    case "changeColor": {
      for (let idx = 0; idx < request.colorPalate.length; idx++) {
        const color = request.colorPalate[idx];
        $('mark.multiple-highlighter-' + idx).css('background', color);
        console.log("colorPalate", color)
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
      const element = elements[position[idx]];
      let parentElement = element.parentElement;
      while (parentElement) {
        if (parentElement.getAttribute("class") && parentElement.getAttribute("class")?.includes("collapse")) {
          console.debug("found collapse element", parentElement)
          parentElement.setAttribute("class", "collapse show");
        }
        parentElement = parentElement.parentElement;
      }

      element.scrollIntoView({
        behavior: 'auto',
        block: 'center',
        inline: 'center',
      });

      // remove border for previous position
      $('mark.multiple-highlighter-' + idx).css('border', 'none');
      // with border for position
      element.setAttribute("style", "border: 2px solid red;");

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
    case "options": {
      // get latest options from storage
      chrome.storage.sync.get(['options'], function (result) {
        console.table(result.options);
        options = result.options
      });
      break;
    }
    default:
      break;
  }
});