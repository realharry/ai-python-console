// Background script for AI Python Console Chrome Extension

let consoleActive = false;

// Handle extension icon click
chrome.action.onClicked.addListener(async (tab) => {
  try {
    // Open side panel for the current tab
    if (tab.id && tab.windowId) {
      await chrome.sidePanel.open({ tabId: tab.id, windowId: tab.windowId });
      setConsoleActive(true);
    }
  } catch (error) {
    console.error('Error opening side panel:', error);
  }
});

// Listen for side panel state changes
chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message.type === 'CONSOLE_STATE_CHANGED') {
    setConsoleActive(message.active);
    sendResponse({ success: true });
  }
  
  if (message.type === 'GET_CONSOLE_STATE') {
    sendResponse({ active: consoleActive });
  }
});

// Set console active state and update badge
function setConsoleActive(active: boolean) {
  consoleActive = active;
  
  // Update badge
  chrome.action.setBadgeText({
    text: active ? '●' : ''
  });
  
  chrome.action.setBadgeBackgroundColor({
    color: active ? '#22c55e' : '#dc2626'
  });
}

// Initialize extension
chrome.runtime.onInstalled.addListener(() => {
  console.log('AI Python Console extension installed');
  setConsoleActive(false);
});

// Handle tab updates to maintain side panel
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  if (consoleActive) {
    try {
      // Get the current window to provide windowId
      const currentWindow = await chrome.windows.getCurrent();
      await chrome.sidePanel.open({ tabId: activeInfo.tabId, windowId: currentWindow.id || 0 });
    } catch (error) {
      // Side panel might not be available on this tab
      console.log('Side panel not available on this tab');
    }
  }
});

export {};