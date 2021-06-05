function getGlobalSettings() {
    let settings = JSON.parse(localStorage.getItem("apertium.settings"));
    if (settings === null) {
        return {
            apertiumSource: "https://apertium.org/apy/",
            defaultLanguage: "eng",
            lastUpdated: "on Installation",
            inputSizeLimit: 1000
        }
    } else {
        return settings;
    }
}

function saveGlobalSettings(settings) {
    let settingsJSON = JSON.stringify(settings);
    localStorage.setItem("apertium.settings", settingsJSON);
}

function getLangPairs() {
    let langPairs = localStorage.getItem("apertium.langPairs");

    if(langPairs === null) {
        let languageList = fetchLanguageList(getLangPairsEndpoint());
        createLanguagePairs(languageList);
    }
}

async function updateLanguagePairs() {
    let time = new Date().toLocaleString();
    let languageList = await fetchLanguageList(getLangPairsEndpoint());
    let languagePairsJSON = JSON.stringify(createLanguagePairs(languageList));

    localStorage.setItem("apertium.langPairs", languagePairsJSON);
    globalSettings.lastUpdated = time;
    setLastUpdated(time);
}

function getLangPairsEndpoint() {
    return globalSettings.apertiumSource + "listPairs";
}

function getTranslationEndpoint() {
    return globalSettings.apertiumSource + "translate";
}

async function fetchLanguageList(listPairURL) {
    return fetch(listPairURL)
        .then(response => response.json())
        .then(data => data.responseData);
}

function createLanguagePairs(languageList){
    let current = new Date();

    let langPairs = {
        last_updated: current.toLocaleString(),
        source: globalSettings.apertiumSource,
        langPairs: languageList
    };

    let langPairsJSON = JSON.stringify(langPairs);
    localStorage.setItem("apertium.langPairs", langPairsJSON);
    return langPairs;
}

function getSourceList() {
    let languageList = JSON.parse(localStorage.getItem("apertium.langPairs")).langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].sourceLanguage);
    }
    return [...new Set(list)];
}

function getTargetList() {
    let languageList = JSON.parse(localStorage.getItem("apertium.langPairs")).langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].targetLanguage);
    }
    return [...new Set(list)];
}