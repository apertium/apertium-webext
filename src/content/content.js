
chrome.runtime.sendMessage({method: "getSettings"}, function (response) {
    let settings = response.settings;
    addHoverElements(settings);
});

async function addHoverElements(settings) {
    let enabledList = settings.enabledWebsites;
    if (enabledList.includes(window.location.hostname)) {
        let sourceLanguage = await getWebsiteLanguage();

        console.log(sourceLanguage);

        addHoverTag(settings.defaultLanguage, sourceLanguage);
    }
}

function getWebsiteLanguage(){
    let text = $('body').text().substring(0,300);
    return detectLanguage(text);
}