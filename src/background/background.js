window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method == "getEnabledList")
        sendResponse({list: getEnabledWebsiteList()});
    else
        sendResponse({}); // snub them.
});

browser.runtime.onInstalled.addListener(function () {
    browser.contextMenus.create({
        "id": "enableTranslation",
        "title": "Enable Hover-On Translation",
        "documentUrlPatterns": ["<all_urls>"],
        "contexts": ["page"]
    });
});

