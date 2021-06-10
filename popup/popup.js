let globalSettings;

init();

// Displays source languages available
$("#source-language-button").on('click', function () {
    let dropdown = $("#source-dropdown-div")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$("#source-dropdown-div").on('click', '.source-language-option', function () {
    let selectedLanguage = getSelectedLanguage($(this));

    setSourceLanguage(selectedLanguage);
    if (selectedLanguage === 'select') {
        createTargetDropdown($("#target-dropdown-div"));
    } else {
        createTargetDropdown($("#target-dropdown-div"), selectedLanguage);
    }
});

// Displays target languages available for current source
$("#target-language-button").on('click', function () {
    let dropdown = $("#target-dropdown-div")[0];
    if (dropdown.style.display === "") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "";
    }
});

$("#target-dropdown-div").on('click', '.target-language-option', function () {
    let selectedLanguage = getSelectedLanguage($(this));

    setTargetLanguage(selectedLanguage);

    if (selectedLanguage === 'select') {
        createSourceDropdown($("#source-dropdown-div"));
    } else {
        createSourceDropdown($("#source-dropdown-div"), selectedLanguage);
    }
});

//TODO: Exchange source and target languages if possible. Set up cases if not
$("#exchange-source-target").on('click', function () {

});

$("#translate-button").on('click', function () {
    let translateInput = getInputText();
    if (!translateInput) return;

    let sourceLanguage = getSourceLanguage();
    if(!sourceLanguage) return;

    let targetLanguage = getTargetLanguage();
    if(!targetLanguage) return;

    getTranslation(translateInput, sourceLanguage, targetLanguage).then(translateOutput => {
        $(".output-text-box").val(translateOutput);
    });
});

// TODO: Translate the entire current webpage
$("#translate-webpage-button").on('click', function () {

});

// TODO: Enable hover if inactive before, disable if active
$("#enable-hover-checkbox").on('click', function () {

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
    }

    inputField.removeClass("error");

    return text;
}

function getSelectedLanguage(selector) {
    selector.addClass("selected-language");
    let text = $(".selected-language").val();
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

async function detectInputLanguage() {
    // TODO
}

function getTargetLanguage(){
    let languageCode = $("#target-language").val();

    if(languageCode === 'select' || languageCode === undefined){
        $("#target-language").addClass('error');
        return null;
    } else {
        return languageCode
    }
}

async function getSourceLanguage(){
    let languageCode = $("#source-language").val();

    if (languageCode === undefined) {
        $("#source-language").addClass('error');
        return null;
    } else if (languageCode === 'detect') {
        await detectInputLanguage();
    } else {
        return languageCode
    }
}

function setTargetLanguage(targetLanguage) {
    let codeMap = getLanguageCodeMap();
    $("#target-language").val(targetLanguage);
    if (codeMap[targetLanguage] === undefined) {
        $("#target-language").text(targetLanguage);
    } else {
        $("#target-language").text(codeMap[targetLanguage]);
    }
}

function setSourceLanguage(sourceLanguage) {
    let codeMap = getLanguageCodeMap();
    $("#source-language").val(sourceLanguage);
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

    parent.append("<option class='enabled-language target-language-option' value='select'>Reset Language</option>");

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

    parent.append("<option class='enabled-language source-language-option' value='detect'>Detect Language</option>");

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