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

async function getTranslation(inputText, sourceLanguage, targetLanguage) {
    let outputText;
    let langPair = "";
    langPair = langPair.concat(sourceLanguage, "|", targetLanguage);

    let url = new URL(getTranslationEndpoint());
    let params = {langpair: langPair, q: inputText, format: "html"};
    url.search = new URLSearchParams(params).toString();

    outputText = await fetch(url)
        .then(response => response.json())
        .then(data => data.responseData.translatedText);

    return outputText;
}
