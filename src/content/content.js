let settings, sourceLanguage;
window.browser = (function () {
    return window.browser || window.chrome;
})();

jQuery.fn.ownText = function () {
    return $(this).contents().filter(function () {
        return this.nodeType === Node.TEXT_NODE;
    }).text();
};

browser.runtime.sendMessage({method: "getSettings"}, function (response) {
    settings = response.settings;
    addHoverElements(settings);
});

browser.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.method !== "translateWebpage") {
        sendResponse({}); //snub all other requests
    }

    if(!sourceLanguage) {
        sourceLanguage = await getWebsiteLanguage();
    }

    await translateWebpage(sourceLanguage, settings.defaultLanguage);
    sendResponse({});
});

async function addHoverElements(settings) {
    let enabledList = settings.enabledWebsites;
    if (enabledList.includes(window.location.hostname)) {
        if(!sourceLanguage) {
            sourceLanguage = await getWebsiteLanguage();
        }

        addHoverTag(settings.defaultLanguage, sourceLanguage);
    }
}

function getWebsiteLanguage(){
    let text = $('body')[0].innerText.substring(0,400);
    return detectLanguage(text);
}