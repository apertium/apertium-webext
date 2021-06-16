let globalSettings;
init()

// Sets default language
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

// TODO: delete a website from the hover list
$(".delete-website").on('click', function () {

});

function init() {
    globalSettings = getGlobalSettings();
    getLangPairs();
    updateEnabledTable($("#enabled-website-tbody"));
    createDropdown($("#target-language-dropdown"));
    setDefaultLanguage(globalSettings.defaultLanguage);
}


function updateEnabledTable(parent) {
    let list = getEnabledWebsiteList();

    parent.empty();
    let rowIter = 1;
    list.forEach((websiteURL) => {
        parent.append("<tr><th scope='row'>" + rowIter + "</th><td>" + websiteURL + "</td><td class='delete-website'><img class='trash-icon' src='../assets/trash.svg' alt='trash icon'></td></tr>");
        rowIter++;
    });
}

function setDefaultLanguage(defaultLanguage) {
    let codeMap = getLanguageCodeMap();
    if (codeMap[defaultLanguage] === undefined) {
        $("#target-language").text(defaultLanguage);
    } else {
        $("#target-language").text(codeMap[defaultLanguage]);
    }
}

function createDropdown(parent) {
    let codeMap = getLanguageCodeMap();
    let list = getTargetList();
    parent.empty();
    list.forEach((languageCode) => {
        let languageName;
        if (codeMap[languageCode] === undefined) {
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