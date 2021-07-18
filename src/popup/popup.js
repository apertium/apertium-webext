let globalSettings;

init();

// Displays source languages available
$("#source-language-button").on('click', function (e) {
    e.stopPropagation();

    let dropdown = $("#source-dropdown-div")[0];
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
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
$("#target-language-button").on('click', function (e) {
    e.stopPropagation();

    let dropdown = $("#target-dropdown-div")[0];
    if (dropdown.style.display === "none") {
        dropdown.style.display = "block";
    } else {
        dropdown.style.display = "none";
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

//Exchange source and target languages if possible
$("#exchange-source-target").on('click', async function () {
    let sourceLanguage = await getSourceLanguage(true);
    let targetLanguage = await getTargetLanguage();

    if (sourceLanguage === 'detect') {
        setSourceLanguage(targetLanguage);
        setTargetLanguage('select');

        createSourceDropdown($("#source-dropdown-div"));
        createTargetDropdown($("#target-dropdown-div"), targetLanguage);
    } else if (targetLanguage === 'select') {
        setSourceLanguage('detect');
        setTargetLanguage(sourceLanguage);

        createSourceDropdown($("#source-dropdown-div"), sourceLanguage);
        createTargetDropdown($("#target-dropdown-div"));
    } else {
        let newTargetList = getTargetwithSource(targetLanguage);

        createSourceDropdown($("#source-dropdown-div"), sourceLanguage);
        setSourceLanguage(targetLanguage);

        if (newTargetList !== [] && newTargetList.includes(sourceLanguage)) {
            setTargetLanguage(sourceLanguage);
            createTargetDropdown($("#target-dropdown-div"), targetLanguage);
        } else {
            setTargetLanguage('select');
            createTargetDropdown($("#target-dropdown-div"));
        }
    }
});

$("#translate-button").on('click', async function () {
    let translateInput = getInputText();
    if (!translateInput) return;

    let sourceLanguage = await getSourceLanguage();
    if (!sourceLanguage) return;

    let targetLanguage = await getTargetLanguage();
    if (!targetLanguage || targetLanguage === 'select') return;

    if(!(await verifyLangPairs(sourceLanguage, targetLanguage))) return;

    getTranslation(translateInput, sourceLanguage, targetLanguage).then(translateOutput => {
        $(".output-text-box").val(translateOutput);
    });
});

// Translate the entire current webpage
$("#translate-webpage-button").on('click', function () {
    window.browser = (function () {
        return window.browser || window.chrome;
    })();

    browser.tabs.query({active: true, currentWindow: true}, function(tabs){
        browser.tabs.sendMessage(tabs[0].id, {method: "translateWebpage"}, function(response) {});
    });
});

// Enable hover if inactive before, disable if active
$("#enable-hover-checkbox").on('click', async function () {
    await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let url = tabs[0].url;
        let hostname = new URL(url).hostname;

        if($(this).is(":checked")){
            addToEnabledWebsiteList(globalSettings, hostname);
        } else {
            removeFromEnabledWebsiteList(globalSettings, hostname);
        }
    });
});

$(document).on('click', function(){
    $("#target-dropdown-div").hide();
    $("#source-dropdown-div").hide();
});

async function init() {
    globalSettings = getGlobalSettings();
    await setCheckBox($("#enable-hover-checkbox"));
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
    let params = {langpair: langPair, q: inputText, deformat: "html"};
    url.search = new URLSearchParams(params).toString();

    outputText = await fetch(url)
        .then(response => response.json())
        .then(data => data.responseData.translatedText);

    return outputText;
}

function detectInputLanguage() {
    let inputText = getInputText();
    return detectLanguage(inputText);
}

function getTargetLanguage(){
    let languageCode = $("#target-language").val();

    if (languageCode === undefined) {
        $("#target-language").addClass('error');
        return null;
    } else {
        return languageCode
    }
}

async function getSourceLanguage(noDetect = false) {
    let languageCode = $("#source-language").val();

    if (languageCode === undefined) {
        $("#source-language").addClass('error');
        return null;
    } else if (languageCode === 'detect') {
        if (noDetect)
            return 'detect';
        else
            return await detectInputLanguage();
    } else {
        return languageCode
    }
}

async function setCheckBox(checkbox){
    await chrome.tabs.query({active: true, lastFocusedWindow: true}, tabs => {
        let hostname = new URL(tabs[0].url).hostname;
        let list = getEnabledWebsiteList();

        if(list.includes(hostname)){
            checkbox.prop('checked', true);
        }
    });
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