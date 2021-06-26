const puppeteer = require('puppeteer');
const assert = require('assert');
const path = require('path');

const timeout = 1000;
const extensionPath = path.join(__dirname, '..','src/');
const extensionName = 'Apertium';
const extensionEndURL = 'settings/settings.html';

let browser = null;
let extensionID = null;
let extensionSettings = null;

describe('Settings Testing', async function () {
    it('Extension can be Loaded', async function () {
        await loadExtension();
        assert.ok(browser, 'Browser has not been loaded')
        assert.ok(extensionID, 'Extension has not been loaded');
    });

    it('UI Elements are Rendered', async function (){
        extensionSettings = await browser.newPage();
        await extensionSettings.goto(`chrome-extension://${extensionID}/${extensionEndURL}`);
    });

    after(async function (){
        await browser.close();
    });
});

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