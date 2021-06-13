window.browser = (function () {
    return window.browser || window.chrome;
})();


browser.runtime.onInstalled.addListener(function () {
    browser.contextMenus.create({
        "id": "enableTranslation",
        "title": "Enable Hover-On Translation",
        "documentUrlPatterns": ["<all_urls>"],
        "contexts": ["page"]
    });
});

