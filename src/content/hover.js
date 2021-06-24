function addHoverTag(targetLanguage, sourceLanguage) {
    // (?![^<]*?>)([A-z0-9']+)
    // - (?![^<]*?>) to not consider any html elements. or rather, to not consider anything wrapped in <>. But since all <'s are coded as &lt; in html, it only affects tags
    // - ([A-z0-9']+) apart from elements, we consider all words, numbers or words containing "'"

    $('p').each(function () {
        $(this).html($(this).html().replace(/(?![^<]*?>)([A-z0-9']+)/g , '<hover data-tooltip="$1" data-tooltip-position="top">$1</hover>'));
    });

    let setTimeoutConst;
    $("hover").hover(function() {
        let self = $(this)
        setTimeoutConst = setTimeout(async function () {
            let text = self.attr('data-tooltip');
            if(self.text() === text) {
                let translation = await translate(text, sourceLanguage, targetLanguage);
                self.attr('data-tooltip', translation);
            }
        }, 1000);
    }, function() {
        clearTimeout(setTimeoutConst);
    });
}

async function translate(inputText, sourceLanguage, targetLanguage) {
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