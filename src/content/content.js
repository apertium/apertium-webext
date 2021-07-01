window.browser = (function () {
    return window.browser || window.chrome;
})();

browser.runtime.sendMessage({method: "getSettings"}, function (response) {
    let settings = response.settings;
    addHoverElements(settings);
});

browser.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.method === "translateWebpage") {
        console.log('hi')
        sendResponse({});
    }
});

async function addHoverElements(settings) {
    let enabledList = settings.enabledWebsites;
    if (enabledList.includes(window.location.hostname)) {
        let sourceLanguage = await getWebsiteLanguage();
        addHoverTag(settings.defaultLanguage, sourceLanguage);
    }
}

function getWebsiteLanguage(){
    let text = $('body').text().substring(0,300);
    return detectLanguage(text);
}