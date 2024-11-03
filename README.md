# youtube-playlist-shuffle

This is a Chromium extension that I wrote for myself to fix YouTube's "Shuffle" functionality in playlists.

There are many issues with the default functionality, mainly the non-randomness of the shuffles. This extension implements a basic `Math.random()` based shuffle to randomly select the next video from a playlist.

![Image](https://i.imgur.com/ouTPjyD.png)

## Installation

1. Download the repository as a folder and save it on your Desktop.
2. Go to `chrome://extensions/` in your browser.
3. In the top-right corner, enable `Developer mode`
4. In the top-left corner, you should now see `Load unpacked` selection. Select it and load the folder from your Desktop.

## Features

1. `Enable Shuffle` option to toggle the extension functionality on/off. If it's turned on, it will function for all playlists.
2. The extension was built for Desktop users. A new random video will be played when: 
- Video finishes by itself.
- In the player, the user clicks "Next" or "Previous" buttons.
- The user "seeks" the video until the end.
- The video unexpectedly changes to some other from the playlist.
3. If the user changes the video manually, it won't be randomized.

## Credits

- YouTube for having an awful Shuffler.
- ChatGPT for introduction to Chromium extensions and styling the popup (CSS).

## Contact

simas123.05 on Discord