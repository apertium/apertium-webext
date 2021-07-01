# Apertium Web Extension

[Apertium Web Extension](https://wiki.apertium.org/wiki/Apertium-Web-Extension) is a Cross-Browser WebExtension Interface for the [Apertium APy](https://github.com/apertium/apertium-apy) service. Apertium WebExt is capable of word translation, website translation as well as offering on-site word translation via use of hover-on gists. It relies entirely on the API service powered by [Apertium](https://apertium.org/).

<br>

## Table of Contents

- [Installation](#installation)
  - [Chrome/Chromium](#chrome-and-chromium)
  - [FireFox](#firefox)
  - [Edge](#microsoft-edge)
- [Navigation](#navigation)
- [Contribution](#contribution)

<br>

## Installation

### Chrome and Chromium

<img align="right" width="360" src="https://github.com/apertium/apertium-webext/blob/main/misc/chrome-extension-select.png" alt="chrome-extension-select">

<br>

1. Navigate to `chrome://extensions` in your browser. You can also access this page by clicking on the Omnibox (three vertical dots), hovering over More Tools and selecting Extensions
2. Check the box next to Developer Mode
3. Click Load Unpacked Extension and select the `apertium-webext/src/` directory
4. Finally, Enable the plugin by checking the toggle

<br>

And you're done! you can use the extension to translate within the pop-up or hover on words as you like. For Additional Information, check the [Getting Started with Extensions](https://developer.chrome.com/docs/extensions/mv3/getstarted/) Page on Chrome Dev.

<br>

### FireFox

<img align="right" width="360" src="https://github.com/apertium/apertium-webext/blob/main/misc/firefox-extension-select.png" alt="firefox extension-select">

<br>

1. Navigate to `about:debugging` and select 'This FireFox'
2. After clicking on "Load Temporary Add-on", select `apertium-webext/src/manifest.json`
3. Yet another option with Firefox is to load the extension from `about:addons` which can be found in the browser omnibox as 'Addons and Themes'
4. Zip the extension files by running `zip -r apertium-webext src/` and pass the zip file to 'Load Extension from File' in the settings dialog

<br>

With that, you're done. For more detailed instructions, there's [this MDN page](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Your_first_WebExtension#installing).

<br>

### Microsoft Edge

<img align="right" width="480" src="https://github.com/apertium/apertium-webext/blob/main/misc/edge-extension-select.png" alt="edge-extension-select">

<br>

1. Open `edge://extensions` by choosing the omnibox (three dots) at the top, and then selecting 'Extensions'
2. Switch on Developer Mode at the bottom of the screen
3. Select Load Unpacked and choose `apertium-webext/src/`

<br>
<br>

Refer to the [Edge Documentation](https://docs.microsoft.com/en-us/microsoft-edge/extensions-chromium/getting-started/extension-sideloading) for additional details regarding installation.

<br>

## Navigation
```
.
├── misc/...
├── src
│   ├── assets/...
│   ├── lib
│   │   ├── bootstrap.min.css
│   │   ├── jquery.min.js
│   │   ├── translate.js
│   │   └── storage.js
│   ├── background
│   │   └── background.html/js
│   ├── content
│   │   └── content.css/js
│   ├── popup
│   │   ├── options.html/js
│   │   └── popup.html/css/js
│   ├── settings
│   │   └── settings.html/css/js
│   └── manifest.json
├── tests
│   ├── popup.test.js
│   ├── options.test.js
│   ├── settings.test.js
│   └── README.md
└── README.md
```

- **lib/**    
All library-ish files i.e. those that contain only function definitions which are called from multiple places. There's jQuery 3.6 and Bootstrap 5.0. storage.js is meant for all functions that deal with localStorage, and hover for hover-translation related stuff.


- **background/**   
background.js contains all background scripts such as the ContextMenu option, the script to redirect the user to the settings page on being installed and so on. 


- **content/**    
Modifying the page DOM can only be done through content scripts. The scripts here are triggered on enabled sites and are the ones responsible for the word-hover and webpage translation functionality


- **popup/**   
holds all the files necessary to build the pop-ups for the main pop-up and the smaller settings pop-up. Also has a local copy of bootstrap 5.


- **settings/**   
files related to the main settings page with all options.


- **manifest.json**   
The manifest for the extension, outlining background scripts, pop-up data and permissions.

<br>

## Contribution

Initially completed as part of [this GSoC Project](https://summerofcode.withgoogle.com/projects/#4924808795521024), all further contributions are welcome.