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
        assert.ok(targetButton, 'Target Button does not Load');

        let targetDropdown = await extensionSettings.$('#target-language-dropdown');
        assert.ok(targetDropdown, 'Target Dropdown does not Load');

        let sourceSelectDropdown = await extensionSettings.$('#source-select');
        assert.ok(sourceSelectDropdown, 'Apertium Source Select Dropdown does not Load');

        let lastUpdated = await extensionSettings.$('#last-updated');
        assert.ok(lastUpdated, 'Last Updated field does not Load');

        let websiteTable = await extensionSettings.$('#website-table');
        assert.ok(websiteTable, 'Enabled Website Table does not Load');
    });

    it('Language Dropdown can be selected', async function () {
        let dropdownButton = await extensionSettings.$('#default-target-language-button');
        let dropdown = await extensionSettings.$('#target-language-dropdown');
        let selectedLanguage = await extensionSettings.$('#target-language');

        await dropdownButton.evaluate(btn => btn.click());
        let languageList = await dropdown.evaluate(() => {
            document.querySelector('option[value="cat"]').click();
            return document.querySelectorAll('option.enabled-language');
        });
        let language = await selectedLanguage.evaluate((btn) => {return btn.innerText});

        assert.ok(Object.keys(languageList).length > 1, "Language Dropdown cannot be populated");
        assert.deepStrictEqual(language, 'Catalan', "Language cannot be selected");
    });

    it('Update button works', async function () {
        let lastUpdated = await extensionSettings.$('#last-updated');
        let updateButton = await extensionSettings.$('#update-button');
        let dropdown = await extensionSettings.$('#target-language-dropdown');

        let prevTime = await lastUpdated.evaluate((span) => {return span.innerText});
        await updateButton.evaluate(button => button.click());
        await extensionSettings.waitForTimeout(timeout);

        let currTime = await lastUpdated.evaluate((span) => {return span.innerText});
        let languageList = await dropdown.evaluate(() => {
            return document.querySelectorAll('option.enabled-language');
        });

        assert.ok(Object.keys(languageList).length > 1, "Language Dropdown cannot be populated");
        assert.notDeepStrictEqual(currTime, prevTime, "Language List does not Update")
    });

    it('Source Select works', async function () {
        let sourceSelectDropdown = await extensionSettings.$('#source-select');
        let dropdown = await extensionSettings.$('#target-language-dropdown');
        let lastUpdated = await extensionSettings.$('#last-updated');

    });

    it('Website Table shows elements', async function () {
        let websiteTable = await extensionSettings.$('#website-table');
        let tableElements = await websiteTable.evaluate(table => {
            return table.children;
        });
        assert(tableElements, "Website Table Elements do not exist");
    });

    it('Website can be added to Table', async function () {
        let inputBar = await extensionSettings.$('#website-input');
        let inputButton = await extensionSettings.$('#add-website-button');
        let websiteTable = await extensionSettings.$('#website-table');

        await inputBar.evaluate(input => input.value = 'example.com');
        await inputButton.evaluate(button => button.click());

        let websiteName = await websiteTable.evaluate(() => {
            return document.querySelector("#enabled-website-tbody > tr:nth-child(3) > td:nth-child(2)").textContent;
        });

        assert.deepStrictEqual(websiteName, 'example.com', 'Cannot add to Website Table')
    });

    it('Website can be deleted from Table', async function () {
        let websiteTable = await extensionSettings.$('#website-table');
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