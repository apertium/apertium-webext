let globalSettings;
init();

$("#default-target-language-button").on('click', function () {
    let dropdown = $("#target-language-dropdown")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$(".enabled-language").on('click', function () {
    let selectedLanguage = getSelectedLanguage($(this));

    globalSettings.defaultLanguage = selectedLanguage;
    setDefaultLanguage(selectedLanguage);
    saveGlobalSettings(globalSettings);
});

$("#update-button").on('click', async function () {
    await updateLanguagePairs();
    saveGlobalSettings(globalSettings);
});

$("#source-select").on('click', async function () {
    let selectedSource = $("#source-select option:selected").text();
    switch (selectedSource) {
        case "Apertium Release":
            globalSettings.apertiumSource = "https://apertium.org/apy/";
            break;
        case "Apertium Beta":
            globalSettings.apertiumSource = "https://beta.apertium.org/apy/";
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
    setDefaultLanguage(globalSettings.defaultLanguage);
    setApertiumSource(globalSettings.apertiumSource);
    setLastUpdated(globalSettings.lastUpdated);
}

function setDefaultLanguage(defaultLanguage) {
    let codeMap = getLanguageCodeMap();
    if(codeMap[defaultLanguage] === undefined) {
        $("#target-language").text(defaultLanguage);
    } else {
        $("#target-language").text(codeMap[defaultLanguage]);
    }

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
    let updatedText = "Last Updated: " + lastUpdated;
    $("#last-updated").text(updatedText);
}

function createDropdown(parent) {
    parent.empty();
    let codeMap = getLanguageCodeMap();
    let list = getTargetList();
    list.forEach((languageCode) => {
        let languageName;
        if(codeMap[languageCode] === undefined) {
            languageName = languageCode;
        } else {
            languageName = codeMap[languageCode];
        }
        parent.append("<option class='enabled-language' value='" + languageCode + "'>" + languageName + "</option>");
    });
}

function getSelectedLanguage(selector) {
    selector.addClass("selected-language");
    let text = $(".selected-language").val();
    selector.removeClass("selected-language");

    return text;
}