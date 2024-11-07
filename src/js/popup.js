document.addEventListener('DOMContentLoaded', () => {
    let toggleSwitch = document.getElementById('toggleSwitch');
    
    chrome.storage.local.get('shuffleEnabled', (data) => {
        toggleSwitch.checked = data.shuffleEnabled ?? true;
    });
    
    toggleSwitch.addEventListener('change', () => {
        let isEnabled = toggleSwitch.checked;
        
        chrome.storage.local.set({ shuffleEnabled: isEnabled }, () => {
            if (!isEnabled) {
                chrome.tabs.query({ url: "*://*.youtube.com/*" }, (tabs) => {
                    tabs.forEach((tab) => {
                        chrome.tabs.reload(tab.id);
                    });
                });                
            }
        });
    });
});
