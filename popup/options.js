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
    setDefaultLanguage(globalSettings.defaultLanguage);
}


function setDefaultLanguage(defaultLanguage) {
    $("#target-language").text(defaultLanguage);
}

function createDropdown(parent) {
    parent.empty();
    let list = getTargetList();
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