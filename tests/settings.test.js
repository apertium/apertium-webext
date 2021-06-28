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

        let targetButton = await extensionSettings.$('#default-target-language-button');
        assert.ok(targetButton, ' does not Load');

        let targetDropdown = await extensionSettings.$('#target-language-dropdown');
        assert.ok(targetDropdown, ' does not Load');

        let sourceSelectDropdown = await extensionSettings.$('#source-select');
        assert.ok(sourceSelectDropdown, ' does not Load');

        let lastUpdated = await extensionSettings.$('#last-updated');
        assert.ok(lastUpdated, ' does not Load');

        let websiteTable = await extensionSettings.$('#website-table');
        assert.ok(websiteTable, ' does not Load');
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