let settings, sourceLanguage;
window.browser = (function () {
    return window.browser || window.chrome;
})();

jQuery.fn.ownText = function () {
    return $(this).contents().filter(function () {
        return this.nodeType === Node.TEXT_NODE;
    }).text();
};

browser.runtime.sendMessage({method: "getSettings"}, async function (response) {
    settings = response.settings;
    await addHoverElements(settings);
});

browser.runtime.onMessage.addListener(async function(request, sender, sendResponse) {
    if (request.method !== "translateWebpage") {
        sendResponse({}); //snub all other requests
    }

    if(!sourceLanguage) {
        sourceLanguage = 'eng';
    }

    if(await verifyLangPairs(sourceLanguage, settings.defaultLanguage)) {
        await translateWebpage(sourceLanguage, settings.defaultLanguage);
        sendResponse({translated: true});
    } else {
        sendResponse({translated: false, problem: 'Invalid Language Pair'});
    }

    return true;
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
    let text = $('body')[0].innerText.substring(0,500);
    return detectLanguage(text);
}