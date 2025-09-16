// Background script for AI Python Console Chrome Extension

let consoleActive = false;

// Handle extension icon click
chrome.action.onClicked.addListener(async (_tab) => {
  try {
    await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    setConsoleActive(true);
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
chrome.tabs.onActivated.addListener(async (_activeInfo) => {
  if (consoleActive) {
    try {
      await chrome.sidePanel.open({ windowId: chrome.windows.WINDOW_ID_CURRENT });
    } catch (error) {
      // Side panel might not be available on this tab
      console.log('Side panel not available on this tab');
    }
  }
});

export {};