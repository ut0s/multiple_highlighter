console.log('background script loaded')

const WAIT_FOR_SIDE_PANEL_TO_BE_READY_MS = 800

const tabIds = new Set<number>();

chrome.runtime.onInstalled.addListener(async (details) => {
  // setting context menu
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

  //
  if (details.reason === 'update') {
    console.log('Extension updated');
    // force reload all tabs
    chrome.tabs.query({}, (tabs) => {
      tabs.forEach((tab) => {
        if (tab.id) {
          chrome.tabs.reload(tab.id);
        }
      });
    });
  }
});

// shortcut command
chrome.commands.onCommand.addListener((command, tab) => {
  console.log(`Command: ${command}`);
  switch (command) {
    case "toggleSidePanel":
      toggleSidePanel(tab?.id);
      break;
    default:
      break;
  }
});

// update context menu by received selected text
chrome.runtime.onMessage.addListener(async (request, sender) => {
  if (request.selectedText) {
    chrome.contextMenus.update('findSelectedText',
      {
        title: ' Add "' + request.selectedText + '" to multiple highlighter',
      },
      () => {
        console.log("context menu updated: ", request.selectedText);
      });
  }

  if (request.command === "isHighlight") {
    console.log("command: isHighlight");
    console.log("tabIds: ", tabIds);
    console.log("sender.tab?.id: ", sender.tab?.id);
    await chrome.runtime.sendMessage({
      isHighlight: tabIds.has(sender.tab?.id),
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
    }, () => {
      console.log("reset to default context menu");
    });
  }

  if (info.menuItemId === 'findSelectedText') {
    console.log("findSelectedText: ", info.selectionText)

    // open side panel on the current tab
    chrome.sidePanel.setOptions({
      tabId: tab?.id,
      path: 'src/sidepanel/index.html',
      enabled: true
    });
    chrome.sidePanel.open({
      tabId: tab?.id,
    });

    // check page is already highlighted
    console.log("tabIds: ", tabIds);
    if (!tabIds.has(tab?.id)) {
      // wait for side panel to be ready
      await new Promise(resolve => setTimeout(resolve, WAIT_FOR_SIDE_PANEL_TO_BE_READY_MS));
      console.log("waited for side panel to be ready")
    } else {
      console.log("page is already highlighted")
    }

    // send selected text to sidepanel
    await chrome.runtime.sendMessage({
      findSelectedText: info.selectionText,
    });

    tabIds.add(tab?.id);
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
      // remove tabId from set
      tabIds.delete(tabId);
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
  tabIds.add(tabId);
}

// when uninstall extension, open a survey form
chrome.runtime.setUninstallURL('https://forms.gle/AyA2n8ygc2WtoXqB6')

export { }
