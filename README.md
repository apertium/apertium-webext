# Apertium Web Extension

[Apertium Web Extension](https://wiki.apertium.org/wiki/Apertium-Web-Extension) is a Cross-Browser WebExtension Interface for the [Apertium APy](https://github.com/apertium/apertium-apy) service. Apertium WebExt is capable of word translation, website translation as well as offering on-site word translation via use of hover-on gists. It relies entirely on the API service powered by [Apertium](https://apertium.org/).


## Table of Contents

- [Installation](#installation)
  - [Chrome/Chromium](#chrome-and-chromium)
  - [FireFox](#firefox)
  - [Edge](#microsoft-edge)
- [Navigation](#navigation)
- [Contribution](#contribution)


## Installation

### Chrome and Chromium

<img align="right" width="360" src="https://github.com/apertium/apertium-webext/blob/main/misc/chrome-extension-select.png">

<br>

1. Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Chrome menu on the top right side of the Omnibox (three vertical dots), hovering over More Tools and selecting Extensions.
2. Check the box next to Developer Mode.
3. Click Load Unpacked Extension and select the `apertium-webext/src/` directory.
4. Finally, Enable the plugin by checking the toggle switch in the extension details box. 

<br>

And you're done! you can use the extension to translate within the pop-up or hover on words as you like. For Additional Information, check the [Getting Started with Extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/) Page on Chrome Dev.

### FireFox

<img align="right" width="360" src="https://github.com/apertium/apertium-webext/blob/main/misc/firefox-extension-select.png">

<br>

1. Navigate to `about:debugging` and select 'This FireFox'
2. After clicking on "Load Temporary Add-on", select `apertium-webext/src/manifest.json`

<br>

With that, you're done. For more detailed instructions, check out [this MDN page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing)

### Microsoft Edge


## Navigation
```
.
├── README.md
├── src
│   ├── assets/...
│   ├── background
│   │   ├── background.js
│   │   ├── jquery.min.js
│   │   └── storage.js
│   ├── content
│   │   ├── content.js
│   │   └── hover.js
│   ├── manifest.json
│   ├── popup
│   │   ├── bootstrap.min.css
│   │   ├── options.html/js
│   │   └── popup.html/css/js
│   └── settings
│       └── settings.html/css/js
└── tests
```
- **Background/**   
background.js contains all background scripts such as the right-click contextmenu option, the script to redirect the user to the settings page on being installed (TODO) and so on. storage.js is meant for all functions that deal with the two localStorage Objects, apertium.settings and apertium.langPairs.


- **Content/**    
Modifying the page DOM can only be done through content scripts. The scripts here are triggered on enabled sites and are the ones responsible for the word-hover and webpage translation functionality


- **Pop-Up/**   
holds all the files necessary to build the pop-ups for the main pop-up and the smaller settings pop-up. Also has a local copy of bootstrap 5.


- **Settings/**   
files related to the main settings page with all options.


- **Manifest/**   
The manifest for the extension, outlining background scripts, pop-up data and permissions.


## Contribution
