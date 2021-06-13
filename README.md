# Apertium Web Extension

[Apertium Web Extension](https://wiki.apertium.org/wiki/Apertium-Web-Extension) is a Cross-Browser WebExtension Interface for the [Apertium APy](https://github.com/apertium/apertium-apy) service. Apertium WebExt is capable of word translation, website translation as well as offering on-site word translation via use of hover-on gists. It relies entirely on the API service powered by [Apertium](https://apertium.org/).


## Table of Contents

- [Installation](#installation)
  - [Chrome/Chromium](#chrome-and-other-chromium-based-browsers)
  - [FireFox](#firefox)
  - [Edge](#microsoft-edge)
- [Navigation](#navigation)
- [Contribution](#contribution)


## Installation

### Chrome and other Chromium-based Browsers

### FireFox

### Microsoft Edge


## Navigation
```
.
└── Apertium WebExt
    ├── assets
    ├── background
    │   ├── background.js
    │   ├── jquery.min.js
    │   └── storage.js
    ├── popup
    │   ├── bootstrap.css
    │   ├── popup.html/css/js
    │   └── options.html/css
    ├── settings
    │   └── settings.html/css/js
    └── manifest.json
```
#### Background
background.js contains all background scripts such as the right-click contextmenu option, the script to redirect the user to the settings page on being installed (TODO) and so on. storage.js is meant for all functions that deal with the two localStorage Objects, apertium.settings and apertium.langPairs.

#### Pop-Up
holds all the files necessary to build the pop-ups for the main pop-up and the smaller settings pop-up. Also has a local copy of bootstrap 5.

#### Settings
files related to the main settings page with all options.

#### Manifest
The manifest for the extension, outlining background scripts, pop-up data and permissions.


## Contribution
