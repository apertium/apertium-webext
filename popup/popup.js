let globalSettings;
let prevText = "";

init();

//TODO: Displays source languages available
$("#source-language-button").click(function () {
    let dropdown = $("#source-dropdown-div")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$(".source-language-option").click(function () {
    let selectedLanguage = getSelectedLanguage($(this));

    setSourceLanguage(selectedLanguage);
    createTargetDropdown($("#target-language-button"), selectedLanguage)
});

//TODO: Displays target languages available for current source
$("#target-language-button").click(function () {
    let dropdown = $("#target-dropdown-div")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$(".target-language-option").click(function () {
    let selectedLanguage = getSelectedLanguage($(this));

    setTargetLanguage(selectedLanguage);
    createSourceDropdown($("#source-language-button"), selectedLanguage);
});

//TODO: Exchange source and target languages if possible. Set up cases if not
$("#exchange-source-target").click( function () {

});

$("#translate-button").click(function () {
    let translateInput = getInputText();
    if (!translateInput) return;

    //TODO: get src and targ languages from user
    let sourceLanguage = "eng";
    let targetLanguage = "spa";

    getTranslation(translateInput, sourceLanguage, targetLanguage).then(translateOutput => {
        $(".output-text-box").val(translateOutput);
    });
});

// TODO: Translate the entire current webpage
$("#translate-webpage-button").click(function () {

});

// TODO: Enable hover if inactive before, disable if active
$("#enable-hover-checkbox").click(function () {

});



function init() {
    globalSettings = getGlobalSettings();
    setTargetLanguage(globalSettings.defaultLanguage);
    createSourceDropdown($("#source-dropdown-div"), globalSettings.defaultLanguage);
    createTargetDropdown($("#target-dropdown-div"));

}

// only return text if it is (a) non-empty; (b) less than the limit; (c) different from the previous input.
function getInputText() {
    let inputField = $(".input-text-box");
    let text = inputField.val();

    if (!text) {
        inputField.addClass("error");
        return null;
    } else if (text.length > globalSettings.inputSizeLimit) {
        inputField.addClass("error");
        return null;
    } else if (text === prevText) {
        return null;
    }

    inputField.removeClass("error");
    prevText = text;

    return text;
}

function getSelectedLanguage(selector) {
    selector.addClass("selected-language");
    let text = $(".selected-language").text();
    selector.removeClass("selected-language");

    return text;
}

async function getTranslation(inputText, sourceLanguage, targetLanguage) {
    let outputText;
    let langPair = "";
    langPair = langPair.concat(sourceLanguage, "|", targetLanguage);

    let url = new URL(getTranslationEndpoint());
    let params = {langpair: langPair, q: inputText, format: "html"};
    url.search = new URLSearchParams(params).toString();

    outputText = await fetch(url)
        .then(response => response.json())
        .then(data => data.responseData.translatedText);

    return outputText;
}

function setTargetLanguage(targetLanguage) {
    let codeMap = getLanguageCodeMap();
    if (codeMap[targetLanguage] === undefined) {
        $("#target-language").text(targetLanguage);
    } else {
        $("#target-language").text(codeMap[targetLanguage]);
    }
}

function setSourceLanguage(sourceLanguage) {
    let codeMap = getLanguageCodeMap();
    if (codeMap[sourceLanguage] === undefined) {
        $("#source-language").text(sourceLanguage);
    } else {
        $("#source-language").text(codeMap[sourceLanguage]);
    }
}

function createTargetDropdown(parent, source = "") {
    parent.empty();
    let codeMap = getLanguageCodeMap();

    let list;
    if (source) {
        list = getTargetwithSource(source);
    } else {
        list = getTargetList();
    }

    list.forEach((languageCode) => {
        let languageName;
        if (codeMap[languageCode] === undefined) {
            languageName = languageCode;
        } else {
            languageName = codeMap[languageCode];
        }
        parent.append("<option class='enabled-language target-language-option' value='" + languageCode + "'>" + languageName + "</option>");
    });
}

function createSourceDropdown(parent, target = "") {
    parent.empty();
    let codeMap = getLanguageCodeMap();

    let list;
    if (target) {
        list = getSourceWithTarget(target);
    } else {
        list = getSourceList();
    }

    list.forEach((languageCode) => {
        let languageName;
        if (codeMap[languageCode] === undefined) {
            languageName = languageCode;
        } else {
            languageName = codeMap[languageCode];
        }
        parent.append("<option class='enabled-language source-language-option' value='" + languageCode + "'>" + languageName + "</option>");
    });
}