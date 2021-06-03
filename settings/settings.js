globalSettings = getGlobalSettings();
createDropdown();


$("#default-target-language-button").click(function () {
    let dropdown = $("#target-language-dropdown")[0];
    if(dropdown.style.display === "") {
        dropdown.style.display ="block";
    } else {
        dropdown.style.display ="";
    }
});

$("#update-button").click(async function () {
    await updateLanguagePairs();
});

$("#source-select").change(async function () {
    let selectedSource = $("#source-select option:selected").text();
    switch (selectedSource) {
        case "Apertium Release":
            globalSettings.ApertiumSource = "https://apertium.org/apy/";
            saveGlobalSettings(globalSettings);
            await updateLanguagePairs();
            break;
        case "Apertium Beta":
            globalSettings.ApertiumSource = "https://beta.apertium.org/apy/";
            saveGlobalSettings(globalSettings);
            await updateLanguagePairs();
            break;
        case "Local/Custom Source":
            alert("Option not available yet");
            break;
    }
});

function getGlobalSettings() {
    let settings = JSON.parse(localStorage.getItem("apertium.settings"));
    if (settings === null) {
        return {
            ApertiumSource: "https://beta.apertium.org/apy/",
            DefaultLanguage: "eng"
        }
    } else {
        return settings;
    }
}

function saveGlobalSettings(settings) {
    let settingsJSON = JSON.stringify(settings);
    localStorage.setItem("apertium.settings", settingsJSON);
}

async function updateLanguagePairs() {
    let languageList = await fetchLanguageList(getLangPairsEndpoint());
    let languagePairsJSON = JSON.stringify(createLanguagePairs(languageList));

    localStorage.setItem("apertium.langPairs", languagePairsJSON);

    // console.log(localStorage.getItem("apertium.langPairs"));
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
    let current = new Date();

    return {
        last_updated: current.toLocaleString(),
        source: globalSettings.ApertiumSource,
        langPairs: languageList
    };
}

function getTargetLanguages() {
    let languageList = JSON.parse(localStorage.getItem("apertium.langPairs")).langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].targetLanguage);
    }
    return [...new Set(list)];
}

function createDropdown() {
    let list = getTargetLanguages();

}