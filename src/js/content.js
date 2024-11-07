'use strict';

let init = false;

let shuffleAndPlayLockTimeout   = 2500;
let shuffleAndPlayLocked        = false;
let shuffleAndPlayLockTimeoutId = null;

let videoItems = [];

let currentUrl      = null;
let currentPlaylist = null;

/**
 * lockShuffleAndPlay
 */
function lockShuffleAndPlay() {
    shuffleAndPlayLocked = true;
    
    if (shuffleAndPlayLockTimeoutId) {
        clearTimeout(shuffleAndPlayLockTimeoutId);
    }
    
    shuffleAndPlayLockTimeoutId = setTimeout(() => {
        shuffleAndPlayLocked = false;
    }, shuffleAndPlayLockTimeout);
}

/**
 * updateVideoItems
 */
function updateVideoItems() {
    videoItems  = [];
    let items   = document.querySelectorAll('ytd-playlist-panel-video-renderer');

    items.forEach((element) => {
        element.querySelector('a').removeEventListener('click', lockShuffleAndPlay);
        element.querySelector('a').addEventListener('click', lockShuffleAndPlay);

        videoItems.push(element);
    });
}

/**
 * shuffleAndPlay
 * @param {Event} event 
 */
function shuffleAndPlay(event) {
    if (event && event.type === 'click') {
        event.preventDefault();
    }
    setTimeout(updateVideoItems, shuffleAndPlayLockTimeout);

    let idx = Math.floor(Math.random() * videoItems.length);
    videoItems[idx].querySelector('a').click();
}

/**
 * getPlaylist
 * @param {String} url 
 * @returns {String}
 */
function getPlaylist(url) {
    const urlObj = new URL(url);
    const params = new URLSearchParams(urlObj.search);
    return params.get('list');
}

/**
 * initialize
 * @returns {void}
 */
function initialize() {
    let player      = document.querySelector('video');
    let prevButton  = document.querySelector('a.ytp-prev-button');
    let nextButton  = document.querySelector('a.ytp-next-button');
    
    updateVideoItems();
    if (!player || !prevButton || !nextButton || videoItems.length <= 1) {
        return;
    }

    /** 
     * 1. When video ends on it's own, trigger shuffleAndPlay:
     */ 
    player.addEventListener('ended', shuffleAndPlay);
    
    /** 
     * 2. When the user clicks "Next" or "Previous" buttons in the player, trigger shuffleAndPlay:
     */
    let cloneNext = nextButton.cloneNode(true);
    nextButton.parentNode.replaceChild(cloneNext, nextButton);
    cloneNext.addEventListener('click', shuffleAndPlay);
    
    let clonePrev = prevButton.cloneNode(true);
    prevButton.parentNode.replaceChild(clonePrev, prevButton);
    clonePrev.addEventListener('click', shuffleAndPlay);
    
    /**
     * 3. When the URL changes to another video from the playlist, trigger shuffleAndPlay:
     */ 
    currentUrl      = window.location.href;
    currentPlaylist = getPlaylist(currentUrl);
    const observer  = new MutationObserver((mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type !== 'childList') {
                continue;
            }

            if (window.location.href === currentUrl) {
                continue;
            }

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
    });
    observer.observe(document.body, { childList: true, subtree: true });
    
    /**
     * 4. Initialize finished:
     */ 
    init = true;
}

/**
 * APPLICATION INITIALIZE INTERVAL:
 */
setInterval(() => {
    if (init) {
        return;
    }
    chrome.storage.local.get('shuffleEnabled', (data) => {
        if (!data.shuffleEnabled) {
            return;
        }
        initialize();
    });
}, 250);