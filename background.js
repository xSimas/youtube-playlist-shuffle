// Function to check if the URL is a YouTube URL
const isYouTubeUrl = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
};

// Function to update the popup based on the active tab
const updatePopup = (tab) => {
    if (tab.url && isYouTubeUrl(tab.url)) {
        // Set the popup to your popup.html
        chrome.action.setPopup({ popup: 'popup.html' });
        } else {
        // If not a YouTube URL, set the popup to empty
        chrome.action.setPopup({ popup: '' });
    }
};

// Listen for tab updates (when the URL changes)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.active) {
        updatePopup(tab);
    }
});

// Listen for tab activation (when switching between tabs)
chrome.tabs.onActivated.addListener((activeInfo) => {
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        updatePopup(tab);
    });
});

// Check the current active tab on extension load
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) {
        updatePopup(tabs[0]); // Update popup based on the current active tab
    }
});
