console.log('hello world from background')

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'toggleSidePanel',
    title: ' Toggle multiple highlighter panel',
    contexts: ['page']
  });

  });
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

// open side panel on the current tab from context menu
chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  console.log("contextMenus.onClicked:", info, tab)

  if (info.menuItemId === 'toggleSidePanel') {
    toggleSidePanel(tab?.id);
  }


    // open side panel on the current tab
    chrome.sidePanel.setOptions({
      tabId: tab?.id,
      path: 'src/sidepanel/index.html',
      enabled: true
    });
    await chrome.sidePanel.open({
      tabId: tab?.id,
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

export { }
