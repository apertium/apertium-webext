let globalSettings;
init()

// Sets default language
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

// TODO: delete a website from the hover list
$(".delete-website").click(function () {

});

function init() {
    globalSettings = getGlobalSettings();
    getLangPairs();
    createDropdown($("#target-language-dropdown"));
    setDefaultLanguage(globalSettings.DefaultLanguage);
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