# YouTube Shuffle Extension

This is a web browser extension that implements a new YouTube playlist shuffle functionality. The extension is compatible with Chromium-based browsers (Google Chrome, Brave, etc).

My main issue with the default shuffle was the non-randomness of the shuffles and YouTube's algorithmic selections for the next video, even though the playlist is "shuffled".

This extension implements a basic JavaScript's `Math.random()` video selection from the currently active playlist. A new video is randomly selected when the current one ends.

![Image](https://i.imgur.com/hvHuToC.png)

## Installation

1. Download the repository and extract the folder on your Desktop: [Link](https://github.com/xSimas/youtube-playlist-shuffle/archive/refs/heads/main.zip)
2. Go to `chrome://extensions/` in your browser.
3. In the top-right corner, enable `Developer mode`
4. In the top-left corner, you should now see `Load unpacked` selection. Select it and load the extenion folder from your Desktop.

## Features

1. Use `Enable Custom Shuffle` option to toggle the extension on/off. When it's turned on, the custom shuffle will work on all playlists. 

2. If you have both enabled; the extension, and YouTube's default shuffle, the extension will not be interrupted and should work as usual.

3. The extension was built for Desktop users. A new random video will be played when: 
    - The video finishes by itself.
    - In the video player, the user clicks "Next" or "Previous" buttons.
    - The user seeks the video until it's end.
    - The video unexpectedly changes to some other from the current playlist.

4. If the user changes the video manually, it won't be randomized.

## Credits

- ChatGPT: Introduction to extensions and styling the extension popup.

## Contact

simas123.05 on Discord