let globalSettings;
init();

$("#default-target-language-button").click(function () {
    let dropdown = $("#target-language-dropdown")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$(".enabled-language").click(function () {
    let selectedLanguage = getSelectedLanguage($(this));

    globalSettings.DefaultLanguage = selectedLanguage;
    $("#target-language").text(selectedLanguage);
    saveGlobalSettings(globalSettings);
});

$("#update-button").click(async function () {
    await updateLanguagePairs();
    saveGlobalSettings(globalSettings);
});

$("#source-select").change(async function () {
    let selectedSource = $("#source-select option:selected").text();
    switch (selectedSource) {
        case "Apertium Release":
            globalSettings.ApertiumSource = "https://apertium.org/apy/";
            break;
        case "Apertium Beta":
            globalSettings.ApertiumSource = "https://beta.apertium.org/apy/";
            break;
        case "Local/Custom Source":
            alert("Option not available yet");
            break;
    }
    await updateLanguagePairs();
    createDropdown($("#target-language-dropdown"));
    saveGlobalSettings(globalSettings);
});

// TODO: hover-enabled table


function init() {
    globalSettings = getGlobalSettings();
    getLangPairs();

    createDropdown($("#target-language-dropdown"));
    setDefaultLanguage(globalSettings.DefaultLanguage);
    setApertiumSource(globalSettings.ApertiumSource);
    setLastUpdated(globalSettings.lastUpdated)
}



function getGlobalSettings() {
    let settings = JSON.parse(localStorage.getItem("apertium.settings"));
    if (settings === null) {
        return {
            ApertiumSource: "https://apertium.org/apy/",
            DefaultLanguage: "eng",
            lastUpdated: "on Installation"
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
    return globalSettings.ApertiumSource + "listPairs";
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
        source: globalSettings.ApertiumSource,
        langPairs: languageList
    };

    let langPairsJSON = JSON.stringify(langPairs);
    localStorage.setItem("apertium.langPairs", langPairsJSON);
    return langPairs;
}

function getTargetLanguages() {
    let languageList = JSON.parse(localStorage.getItem("apertium.langPairs")).langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].targetLanguage);
    }
    return [...new Set(list)];
}



function setDefaultLanguage(defaultLanguage) {
    $("#target-language").text(defaultLanguage);
}

function setApertiumSource(apertiumSource) {
    let sourceSelect = $("#source-select");
    switch (apertiumSource) {
        case "https://apertium.org/apy/":
            sourceSelect.val("release").change();
            break;
        case "https://beta.apertium.org/apy/":
            sourceSelect.val("beta").change();
            break;
        case "Local/Custom Source":
            sourceSelect.val("custom").change();
            break;
    }
}

function setLastUpdated(lastUpdated) {
    let updatedText = "Last Updated: " + lastUpdated
    $("#last-updated").text(updatedText);
}

function createDropdown(parent) {
    parent.empty();
    let list = getTargetLanguages();
    list.forEach((languageCode) => {
        parent.append("<option class='enabled-language' value='" + languageCode + "'>" + languageCode + "</option>");
    })
}

function getSelectedLanguage(selector) {
    selector.addClass("selected-language");
    let text = $(".selected-language").text();
    selector.removeClass("selected-language");

    return text;
}