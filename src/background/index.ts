console.log('hello world from background')

chrome.runtime.onInstalled.addListener(async () => {
  chrome.contextMenus.create({
    id: 'toggleSidePanel',
    title: 'Toggle multiple highlighter panel',
    contexts: ['all']
  });
});

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === 'toggleSidePanel') {
    console.log("contextMenus.onClicked:", info, tab)
    // if side panel is already open, close it
    chrome.sidePanel.getOptions({ tabId: tab?.id }).then((options) => {
      console.log("getOptions:", options)
      if (options.enabled) {
        chrome.sidePanel.setOptions({
          tabId: tab?.id,
          path: 'src/sidepanel/index.html',
          enabled: false
        });
      }
    });

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
export { }
