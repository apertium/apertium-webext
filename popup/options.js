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
    createDropdown($("#target-language-dropdown"));
    setDefaultLanguage(globalSettings.defaultLanguage);
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
    parent.empty();
    let codeMap = getLanguageCodeMap();
    let list = getTargetList();
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
    let text = $(".selected-language").text();
    selector.removeClass("selected-language");

    return text;
}