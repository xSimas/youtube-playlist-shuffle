document.addEventListener('DOMContentLoaded', () => {
    const toggleSwitch = document.getElementById('toggleSwitch');
    
    // Get the current status from storage and set the switch position
    chrome.storage.local.get('shuffleEnabled', (data) => {
        toggleSwitch.checked = data.shuffleEnabled ?? true; // Default to enabled if not set
    });
    
    // Listen for toggle switch changes
    toggleSwitch.addEventListener('change', () => {
        const isEnabled = toggleSwitch.checked;
        
        chrome.storage.local.set({ shuffleEnabled: isEnabled }, () => {
            if (!isEnabled) {
                chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
                    chrome.tabs.reload(tabs[0].id);
                });
            }
        });
    });
});
