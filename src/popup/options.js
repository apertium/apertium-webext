let globalSettings;
init()

// Sets default language
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

// Deletes a website from the hover list
$(".delete-website").on('click', function () {
    console.log('hi')
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

$(document).click(function () {
    $("#target-language-dropdown").hide();
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
        parent.append("<tr><th scope='row'>" + rowIter + "</th><td>" + websiteURL + "</td><td class='delete-website' data-url='" + websiteURL + "'><img class='trash-icon' src='../assets/trash.svg' alt='trash icon'></td></tr>");
        rowIter++;
    });

    $(".delete-website").on('click', function () {
        let hostname = $(this).attr("data-url");

        removeFromEnabledWebsiteList(globalSettings, hostname);
        updateEnabledTable($("#enabled-website-tbody"));
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