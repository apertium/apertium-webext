const puppeteer = require('puppeteer');
const assert = require('assert');
const path = require('path')

const timeout = 1000;
const extensionPath = path.join(__dirname, '..','src/');
const extensionName = 'Apertium';
const extensionEndURL = 'popup/popup.html';

let browser = null;
let extensionID = null;
let extensionPopup = null;

describe('Pop-Up Testing', async function () {
    it('Extension can be Loaded', async function () {
        await loadExtension();
        assert.ok(browser, 'Browser has not been loaded')
        assert.ok(extensionID, 'Extension has not been loaded');
    });

    it('UI Elements are Rendered', async function (){
        extensionPopup = await browser.newPage();
        await extensionPopup.goto(`chrome-extension://${extensionID}/${extensionEndURL}`);

        let sourceDropdown = await extensionPopup.$('#source-dropdown-div');
        assert.ok(sourceDropdown, 'Source Dropdown does not Render');

        let targetDropdown = await extensionPopup.$('#target-dropdown-div');
        assert.ok(targetDropdown, 'Target Dropdown does not Render');

        let switchButton = await extensionPopup.$('#exchange-source-target');
        assert.ok(switchButton, 'Switch Language Button does not Render');

        let inputBar = await extensionPopup.$('#input-text-bar');
        assert.ok(inputBar, 'Input Bar does not Render');

        let outputBar = await extensionPopup.$('#output-text-bar');
        assert.ok(outputBar, 'Output Bar does not Render');

        let translateButton = await extensionPopup.$('#translate-button');
        assert.ok(translateButton, 'Translate Button does not Render');

        let translateWebpageButton = await extensionPopup.$('#translate-webpage-button');
        assert.ok(translateWebpageButton, 'Translate Webpage Button does not Render');

        let enableCheckBox = await extensionPopup.$('#enable-hover-checkbox');
        assert.ok(enableCheckBox, 'Enable CheckBox does not Render');
    });

    it('Language Dropdowns can be Loaded', async function (){

    });

    it('In-Popup Translation Works', async function (){

    });

    after(async function (){
        await browser.close();
    });
})

async function getExtensionID(browser) {
    //required to let browser page load
    const dummyPage = await browser.newPage();
    await dummyPage.waitForTimeout(timeout);

    const targets = await browser.targets();
    const extensionTarget = targets.find(({_targetInfo}) => {
        return _targetInfo.title === extensionName && _targetInfo.type === 'background_page';
    });

    // Extract the URL
    const extensionURL = extensionTarget._targetInfo.url;
    const urlSplit = extensionURL.split('/');

    return urlSplit[2];
}

async function loadExtension() {
    browser = await puppeteer.launch({
        headless: false,
        args: [
            `--disable-extensions-except=${extensionPath}`,
            `--load-extension=${extensionPath}`
        ]
    });

    extensionID = await getExtensionID(browser);
}

// (async () => {
//     try {
//         await loadExtension();
//
//         const page = await browser.newPage();
//         await page.goto(`chrome-extension://${extensionID}/${extensionEndURL}`);
//
//         page.waitForTimeout(2000);
//         await page.screenshot({path: 'chromium-extension.png'});
//
//         await browser.close();
//     } catch (err) {
//         console.error(err);
//     }
// })();