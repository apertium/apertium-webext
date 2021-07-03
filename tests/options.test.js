const puppeteer = require('puppeteer');
const assert = require('assert');
const path = require('path');

const timeout = 1500;
const extensionPath = path.join(__dirname, '..','src/');
const extensionName = 'Apertium';
const extensionEndURL = 'popup/options.html';

let browser = null;
let extensionID = null;
let extensionOptions = null;

describe('Options Testing', async function () {
    it('Extension can be Loaded', async function () {
        await loadExtension();
        assert.ok(browser, 'Browser has not been loaded')
        assert.ok(extensionID, 'Extension has not been loaded');
    });

    it('UI Elements are Rendered', async function (){
        extensionOptions = await browser.newPage();
        await extensionOptions.goto(`chrome-extension://${extensionID}/${extensionEndURL}`);

        let targetButton = await extensionOptions.$('#default-target-language-button');
        assert.ok(targetButton, 'Target Button does not Load');

        let targetDropdown = await extensionOptions.$('#target-language-dropdown');
        assert.ok(targetDropdown, 'Target Dropdown does not Load');

        let websiteTable = await extensionOptions.$('#website-table');
        assert.ok(websiteTable, 'Website Table does not Load');

        let inputBar = await extensionOptions.$('#website-input');
        assert.ok(inputBar, 'Input Bar does not Load')

        let additionalSettingsLink = await extensionOptions.$('#additional-settings');
        assert.ok(additionalSettingsLink, 'Additional Settings link does not Load');

    });

    it('Website Table shows elements', async function (){
        let websiteTable = await extensionOptions.$('#website-table');
        let tableElements = await websiteTable.evaluate(table => {
            return table.children;
        });
        assert(tableElements, "Website Table Elements do not exist");
    });

    it('Website can be added to Table', async function () {
        let inputBar = await extensionOptions.$('#website-input');
        let inputButton = await extensionOptions.$('#add-website-button');
        let websiteTable = await extensionOptions.$('#website-table');

        await inputBar.evaluate(input => input.value = 'example.com');
        await inputButton.evaluate(button => button.click());

        let websiteName = await websiteTable.evaluate(() => {
            return document.querySelector("#enabled-website-tbody > tr:nth-child(3) > td:nth-child(2)").textContent;
        });

        assert.deepStrictEqual(websiteName, 'example.com', 'Cannot add to Website Table')
    });

    it('Website can be deleted from Table', async function () {
        let websiteTable = await extensionOptions.$('#website-table');
        let prevNumberElements = await parseInt(websiteTable.evaluate(table => {
            return document.querySelector("#enabled-website-tbody > tr:last-child > th").textContent;
        }));

        let newNumberElements = await parseInt(websiteTable.evaluate(table => {
            return document.querySelector("#enabled-website-tbody > tr:last-child > th").textContent;
        }));

        assert.deepStrictEqual(newNumberElements, prevNumberElements - 1, 'Website Elements cannot be deleted')
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