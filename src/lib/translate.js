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

async function translateWebpage(sourceLanguage, targetLanguage) {
    console.log('inside translatepage');

    let textElements = [];

    // on passing the entire body it just returns the body again so I'm passing the children individually
    $('body').children().each(function () {
        getBlockNodes($(this)[0], textElements);
    });

    textElements = [...new Set(textElements)];

    let transportDocument = createNewDocument(textElements);

    let translatedDocument = await getTranslatedDocument(sourceLanguage, targetLanguage, transportDocument, 'transport.html');
    console.log(translatedDocument);
}

function createNewDocument(nodeList) {
    let data = "";

    nodeList.forEach((node, index) => {
        data += '<' + index + '>';
        data += node;
        data += '<' + index + '>\n\n';
    })

    return new Blob([data], {type: 'text/plain'});
}

// purely for test purposes
function download(file, filename) {
    let a = document.createElement("a"), url = URL.createObjectURL(file);
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();
    setTimeout(function () {
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
    }, 0);
}

async function getTranslatedDocument(sourceLanguage, targetLanguage, file, filename) {
    let langPair = "";
    langPair = langPair.concat(sourceLanguage, "|", targetLanguage);

    let formData = new FormData();
    formData.append('langpair', langPair);
    formData.append('file', file, filename)

    let blob = await fetch(getTranslateDocEndpoint(), {
        method: 'POST',
        body: formData
    }).then(response => response.blob());

    download(blob, filename);
    return (await blob).text();
}

// everything below courtesy of https://gist.github.com/TinoDidriksen/c41c33ca5809ff297bf7b1608b3a41e2
const text_nodes = {
    'ADDRESS': true, 'ARTICLE': true, 'ASIDE': true, 'AUDIO': true, 'BLOCKQUOTE': true, 'BODY': true,
    'CANVAS': true, 'DD': true, 'DIV': true, 'DL': true, 'FIELDSET': true, 'FIGCAPTION': true, 'FIGURE': true,
    'FOOTER': true, 'FORM': true, 'H1': true, 'H2': true, 'H3': true, 'H4': true, 'H5': true, 'H6': true,
    'HEADER': true, 'HGROUP': true, 'HTML': true, 'HR': true, 'MAIN': true, 'NAV': true,
    'NOSCRIPT': true, 'OL': true, 'OUTPUT': true, 'P': true, 'PRE': true, 'SECTION': true, 'TABLE': true,
    'TD': true, 'TH': true, 'UL': true, 'VIDEO': true
};

function getBlockNodes(body, uniqueTextNodesList) {
    let textNodes = findTextNodes(body);
    let blockNodesList = [];
    for (let i = 0; i < textNodes.length; ++i) {
        let n = textNodes[i];
        do {
            n = n.parentNode;
        } while (n && n.parentNode && !text_nodes.hasOwnProperty(n.nodeName));

        // Only add unseen parent nodes
        if (blockNodesList.indexOf(n) === -1) {
            blockNodesList.push(n);
        }
    }

    // Deduplicate found parent nodes, and mark the unique ones for tracking
    for (let i = 0; i < blockNodesList.length; ++i) {
        let p = blockNodesList[i];
        do {
            p = p.parentNode;
            if (blockNodesList.indexOf(p) !== -1) {
                // console.log(['Skipping node with a parent already in the set', blockNodesList[i]]);
                blockNodesList[i] = null;
                break;
            }
        } while (p && p.parentNode);

        if (blockNodesList[i]) {
            blockNodesList[i].setAttribute('data-replace-id', uniqueTextNodesList.length);
            uniqueTextNodesList.push(blockNodesList[i].innerHTML);
        }
    }

    return uniqueTextNodesList;
}

function findTextNodes(nodesList) {
    let textNodesList = [], noWhitespace = /\S/;

    if (!$.isArray(nodesList)) {
        nodesList = [nodesList];
    }

    function _findTextNodes(node) {
        if (node.nodeType === 3) {
            if (noWhitespace.test(node.nodeValue)) {
                textNodesList.push(node);
            }
        } else {
            for (let i = 0; i < node.childNodes.length; ++i) {
                _findTextNodes(node.childNodes[i]);
            }
        }
    }

    for (let i = 0; i < nodesList.length; ++i) {
        _findTextNodes(nodesList[i]);
    }
    return textNodesList;
}