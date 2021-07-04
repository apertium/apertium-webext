function addHoverTag(targetLanguage, sourceLanguage) {
    // (?![^<]*?>)([A-z0-9']+)
    // - (?![^<]*?>) to not consider any html elements. or rather, to not consider anything wrapped in <>. But since all <'s are coded as &lt; in html, it only affects tags
    // - ([A-z0-9']+) apart from elements, we consider all words, numbers or words containing "'"

    $('p').each(function () {
        $(this).html($(this).html().replace(/(?![^<]*?>)([A-z0-9']+)/g , '<hover data-translation="$1" data-translation-position="top">$1</hover>'));
    });

    let setTimeoutConst;
    $("hover").hover(function() {
        let self = $(this)
        setTimeoutConst = setTimeout(async function () {
            let text = self.attr('data-translation');
            if(self.text() === text) {
                let translation = await translateWord(text, sourceLanguage, targetLanguage);
                self.attr('data-translation', translation);
            }
        }, 1000);
    }, function() {
        clearTimeout(setTimeoutConst);
    });
}

async function translateWord(inputText, sourceLanguage, targetLanguage) {
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

async function translateWebpage(sourceLanguage, targetLanguage){
    console.log('inside translatepage');
    let text;
    let arr = []
    //iterate over all elements that are 'parents'
    $(":parent").each(function () {
        //filter out those that have innertext
        text = $(this).ownText();
        if(text.length > 0 && /[a-zA-Z]/.test(text)) {
            arr.push(text);
        }
    });

    console.log(arr);
}