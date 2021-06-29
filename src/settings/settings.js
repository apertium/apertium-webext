let globalSettings;
init();

$("#default-target-language-button").on('click', function (e) {
    e.stopPropagation();

    let dropdown = $("#target-language-dropdown")[0];
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
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

// Delete a website from hover-enabled table
$(".delete-website").on('click', function () {
    let hostname = $(this).attr("data-url");

    removeFromEnabledWebsiteList(globalSettings, hostname);
    updateEnabledTable($("#enabled-website-tbody"));
});

// Add website from table
$("#add-website-button").on('click', function () {
    let url = $('#website-input').val();

    addToEnabledWebsiteList(globalSettings, url);
    updateEnabledTable($("#enabled-website-tbody"));
});

$(document).click(function(){
    $("#target-language-dropdown").hide();
});

function init() {
    globalSettings = getGlobalSettings();
    getLangPairs();

    createDropdown($("#target-language-dropdown"));
    updateEnabledTable($("#enabled-website-tbody"));
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

function updateEnabledTable(parent) {
    let list = getEnabledWebsiteList();

    parent.empty();
    let rowIter = 1;
    list.forEach((websiteURL) => {
        parent.append("<tr><th scope='row'>" + rowIter + "</th><td>" + websiteURL + "</td><td class='delete-website' data-url='"+websiteURL+"'><img class='trash-icon' src='../assets/trash.svg' alt='trash icon'></td></tr>");
        rowIter++;
    });
}