function addHoverTag(targetLanguage) {
    $('p').each(function () {
        $(this).html($(this).html().replace(/(?![^<]*?>)([A-z0-9']+)/g , '<hover data-tooltip="$1" data-tooltip-position="top">$1</hover>'));
    });

    let setTimeoutConst;
    $("hover").hover(function() {
        let self = $(this)
        setTimeoutConst = setTimeout(async function () {
            let text = self.attr('data-tooltip');
            let translation = await getTranslation(text, 'eng', targetLanguage);
            self.attr('data-tooltip', translation);
        }, 1000);
    }, function() {
        clearTimeout(setTimeoutConst);
    });

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