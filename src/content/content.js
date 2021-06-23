chrome.runtime.sendMessage({method: "getSettings"}, function (response) {
    let enabledList = response.settings;
    addHoverElements(enabledList);
});

function addHoverElements(settings) {
    let enabledList = settings.enabledWebsites;
    if (enabledList.includes(window.location.hostname)) {
        addHoverTag(settings.defaultLanguage);
    }
}

