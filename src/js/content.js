let init = false;

let shuffleAndPlayLockTimeout = 2500;
let shuffleAndPlayLocked = false;
let shuffleAndPlayLockTimeoutId = null;

// Manage lock for shuffleAndPlay function so that it's not triggered too frequently:
function lockShuffleAndPlay() {
    shuffleAndPlayLocked = true;
    
    if (shuffleAndPlayLockTimeoutId) {
        clearTimeout(shuffleAndPlayLockTimeoutId);
    }
    
    shuffleAndPlayLockTimeoutId = setTimeout(() => {
        shuffleAndPlayLocked = false;
    }, shuffleAndPlayLockTimeout);
}

// Manage videoItems:
let videoItems = [];
function updateVideoItems() {
    videoItems  = [];
    const items = document.querySelectorAll('ytd-playlist-panel-video-renderer');

    items.forEach((element) => {
        element.querySelector('a').removeEventListener('click', lockShuffleAndPlay);
        element.querySelector('a').addEventListener('click', lockShuffleAndPlay);

        videoItems.push(element);
    });
}

// Main shuffleAndPlay function:
function shuffleAndPlay(event) {
    if (event && event.type === 'click') {
        event.preventDefault();
    }
    setTimeout(updateVideoItems, shuffleAndPlayLockTimeout);

    const idx = Math.floor(Math.random() * videoItems.length);
    videoItems[idx].querySelector('a').click();
}

function initialize() {
    chrome.storage.local.get('shuffleEnabled', (data) => {
        if (!data.shuffleEnabled) {
            return; // Exit if shuffle is disabled
        }
        
        const player = document.querySelector('video');
        updateVideoItems();
        
        let prevButton = document.querySelector('a.ytp-prev-button');
        let nextButton = document.querySelector('a.ytp-next-button');
        
        if (!init && player && prevButton && nextButton && videoItems.length > 1) {
            // 1. When video ends on it's own, trigger shuffleAndPlay:
            player.addEventListener('ended', shuffleAndPlay);
            
            // 2. When we click "Next" or "Previous" buttons in the player, trigger shuffleAndPlay:
            let cloneNext = nextButton.cloneNode(true);
            nextButton.parentNode.replaceChild(cloneNext, nextButton);
            cloneNext.addEventListener('click', shuffleAndPlay);
            
            let clonePrev = prevButton.cloneNode(true);
            prevButton.parentNode.replaceChild(clonePrev, prevButton);
            clonePrev.addEventListener('click', shuffleAndPlay);
            
            // 3. When the URL changes unexpectedly (e.g. we drag the video seeker to the end - no way to detect that properly), trigger shuffleAndPlay:
            function getPlaylist(url) {
                const urlObj = new URL(url);
                const params = new URLSearchParams(urlObj.search);
                return params.get('list');
            }
            let currentUrl = window.location.href;
            let currentPlaylist = getPlaylist(currentUrl);
            const observer = new MutationObserver((mutationsList) => {
                for (const mutation of mutationsList) {
                    if (mutation.type === 'childList') {
                        if (window.location.href !== currentUrl) {
                            currentUrl = window.location.href;
                            if (currentPlaylist === getPlaylist(currentUrl)) {
                                if (!shuffleAndPlayLocked) {
                                    shuffleAndPlay();
                                } else {
                                    setTimeout(updateVideoItems, shuffleAndPlayLockTimeout);
                                }
                            } else {
                                window.location.href = currentUrl;
                            }
                        }
                    }
                }
            });
            observer.observe(document.body, { childList: true, subtree: true });
            
            // Initialize finished:
            init = true;
        }
    });
}
setInterval(initialize, 250);
