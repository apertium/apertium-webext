window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "getEnabledList") {
        sendResponse({list: getEnabledWebsiteList()});
    } else {
        sendResponse({}); // snub them.
    }
});

browser.runtime.onInstalled.addListener(function () {
    browser.contextMenus.create({
        "id": "enableTranslation",
        "title": "Toggle Hover-On Translation",
        "documentUrlPatterns": ["<all_urls>"],
        "contexts": ["page"],
    });
});

chrome.contextMenus.onClicked.addListener(function (info, tab) {
    if (info.menuItemId === "enableTranslation") {
        addToEnabledWebsiteList(getGlobalSettings(), tab.url);
    }
});