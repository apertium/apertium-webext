let globalSettings = getGlobalSettings();
let prevText = "";

//TODO: Displays source languages available
$("#source-language-dropdown").click(function () {
    let sourceLanguageList = getSourceList();
    createDropdown($("#source-dropdown-div"), sourceLanguageList);
});

//TODO: Displays target languages available for current source
$("#target-language-dropdown").click(function () {

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

function createDropdown(parent, list) {
    parent.empty();
    list.forEach((languageCode) => {
        parent.append("<option class='enabled-language' value='" + languageCode + "'>" + languageCode + "</option>");
    })
}
