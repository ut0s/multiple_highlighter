console.log('hello world from background')

// Allows users to open the side panel by clicking on the action toolbar icon
chrome.sidePanel
  .setPanelBehavior({ openPanelOnActionClick: true })
  .catch((error) => console.error(error));

chrome.tabs.onUpdated.addListener(async (tabId, info, tab) => {
  // console.table({ tabId, info, tab })
  await chrome.sidePanel.setOptions({
    tabId,
    path: 'src/sidepanel/index.html',
    enabled: true
  });
});

export { }
