globalSettings = getGlobalSettings();

$("#update-button").click(async function () {
    let languageList = await fetchLanguageList(getLangPairsEndpoint());
    let languagePairsJSON = JSON.stringify(createLanguagePairs(languageList));

    localStorage.setItem("apertium.langPairs", languagePairsJSON);

    console.log(localStorage.getItem("apertium.langPairs"));
});

$("#source-select").change(function () {
    let selectedSource = $("#source-select option:selected").text();
    switch (selectedSource) {
        case "Apertium Release":
            globalSettings.ApertiumSource = "https://apertium.org/apy/";
            saveGlobalSettings();
            break;
        case "Apertium Beta":
            globalSettings.ApertiumSource = "https://beta.apertium.org/apy/";
            saveGlobalSettings();
            break;
        case "Local/Custom Source":
            alert("Option not available yet");
            break;
    }
});

function getGlobalSettings() {
    let settings = localStorage.getItem("apertium.settings")

    if (settings === null) {
        return {
            ApertiumSource: "https://beta.apertium.org/apy/"
        }
    } else {
        return settings;
    }
}

function saveGlobalSettings(settings) {
    let settingsJSON = JSON.stringify(createLanguagePairs(settings));
    localStorage.setItem("apertium.settings", settingsJSON);
}

function getLangPairsEndpoint() {
    return globalSettings.ApertiumSource + "listPairs";
}

async function fetchLanguageList(listPairURL) {
    return fetch(listPairURL)
        .then(response => response.json())
        .then(data => data.responseData);
}

function createLanguagePairs(languageList){
    let current = new Date()

    return {
        last_updated: current.toLocaleString(),
        source: globalSettings.ApertiumSource,
        langPairs: languageList
    }
}