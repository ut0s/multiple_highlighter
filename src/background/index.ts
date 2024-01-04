console.log('hello world from background')

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'toggleSidePanel',
    title: ' Toggle multiple highlighter panel',
    contexts: ['page']
  });

  chrome.contextMenus.create({
    id: 'findSelectedText',
    title: ' Add selected text to multiple highlighter',
    contexts: ['selection']
  });
});

// update context menu by received selected text
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log("runtime.onMessage:", request, sender, sendResponse)

  if (request.selectedText) {
    chrome.contextMenus.update('findSelectedText',
      {
        title: ' Add "' + request.selectedText + '" to multiple highlighter',
      },
      () => {
        console.log("context menu updated")
      });

  }
});


// open side panel on the current tab from context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("contextMenus.onClicked:", info, tab)

  if (info.menuItemId === 'toggleSidePanel') {
    toggleSidePanel(tab?.id);

    // reset to default context menu
    chrome.contextMenus.update('findSelectedText', {
      title: ' Add selected text to multiple highlighter',
    });
  }

  if (info.menuItemId === 'findSelectedText') {
    console.log("findSelectedText", info.selectionText)

    // open side panel on the current tab
    chrome.sidePanel.setOptions({
      tabId: tab?.id,
      path: 'src/sidepanel/index.html',
      enabled: true
    });
    chrome.sidePanel.open({
      tabId: tab?.id,
    });

    // send selected text to sidepanel
    chrome.runtime.sendMessage({
      findSelectedText: info.selectionText,
    });
  }
});

// open side panel on the current tab from toolbar icon
chrome.action.onClicked.addListener(async (tab) => {
  console.log("action.onClicked:", tab)

  toggleSidePanel(tab?.id);
});

async function toggleSidePanel(tabId: number) {
  // if side panel is already open, close it
  chrome.sidePanel.getOptions({ tabId: tabId }).then((options) => {
    console.log("getOptions:", options)
    if (options.enabled && options.enabled === true) {
      chrome.sidePanel.setOptions({
        tabId: tabId,
        enabled: false
      });
    }
  });

  // open side panel on the current tab
  chrome.sidePanel.setOptions({
    tabId: tabId,
    path: 'src/sidepanel/index.html',
    enabled: true
  });
  await chrome.sidePanel.open({
    tabId: tabId,
  });
}

// when uninstall extension, open a survey form
chrome.runtime.setUninstallURL('https://forms.gle/AyA2n8ygc2WtoXqB6')

export { }
