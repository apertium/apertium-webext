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
    let updatedText = "Last Updated: " + lastUpdated;
    $("#last-updated").text(updatedText);
}

function createDropdown(parent) {
    parent.empty();
    let list = getTargetList();
    list.forEach((languageCode) => {
        parent.append("<option class='enabled-language' value='" + languageCode + "'>" + languageCode + "</option>");
    });
}

function getSelectedLanguage(selector) {
    selector.addClass("selected-language");
    let text = $(".selected-language").text();
    selector.removeClass("selected-language");

    return text;
}