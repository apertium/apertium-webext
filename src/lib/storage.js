//GlobalSettings
function getGlobalSettings() {
    let settings = JSON.parse(localStorage.getItem("apertium.settings"));
    if (settings === null) {
        settings = {
            apertiumSource: "https://apertium.org/apy/",
            defaultLanguage: "eng",
            enabledWebsites: ["en.wikipedia.org", "stackoverflow.com"],
            lastUpdated: "on Installation",
            inputSizeLimit: 1000
        };
        saveGlobalSettings(settings);
        return settings;
    } else {
        return settings;
    }
}

function saveGlobalSettings(settings) {
    let settingsJSON = JSON.stringify(settings);
    localStorage.setItem("apertium.settings", settingsJSON);
}


//Language Pairs
function getLangPairs() {
    let langPairs = localStorage.getItem("apertium.langPairs");

    if(langPairs === null) {
        let languageList = fetchLanguageList(getLangPairsEndpoint());
        console.log(languageList)
        createLanguagePairs(languageList);
    }

    return JSON.parse(langPairs);
}

async function fetchLanguageList(listPairURL) {
    return fetch(listPairURL)
        .then(response => response.json())
        .then(data => data.responseData);
}

function createLanguagePairs(languageList){
    let current = new Date();

    let langPairs = {
        last_updated: current.toLocaleString(),
        source: getGlobalSettings().apertiumSource,
        langPairs: languageList
    };

    let langPairsJSON = JSON.stringify(langPairs);
    localStorage.setItem("apertium.langPairs", langPairsJSON);
    return langPairs;
}

async function updateLanguagePairs() {
    let time = new Date().toLocaleString();
    let languageList = await fetchLanguageList(getLangPairsEndpoint());
    let languagePairsJSON = JSON.stringify(createLanguagePairs(languageList));

    localStorage.setItem("apertium.langPairs", languagePairsJSON);
    getGlobalSettings().lastUpdated = time;
}

function getLanguageCodeMap(){
    return {
        "detect" : "Detect Language",
        "deu" : "Deutsch",
        "nld" : "Dutch",
        "heb" : "Hebrew",
        "mlt" : "Maltese",
        "mlt_translit" : "Maltese(translit.)",
        "cat" : "Catalan",
        "cym" : "Welsh",
        "spa" : "Spanish",
        "ben" : "Bangali",
        "eng" : "English",
        "rus" : "Russian",
        "eus" : "Basque",
        "tat" : "Tatar",
        "btc" : "Bati",
        "asm" : "Assamese",
        "fra" : "French",
        "bas" : "Basaa",
        "khk" : "Khalkha Mongolian",
        "mkd" : "Macedonian",
        "epo" : "Esperanto",
        "arg" : "Aragonese",
        "eng_US" : "English(US)",
        "glg" : "Galician",
        "ina" : "Interlingua",
        "ita" : "Italian",
        "oci" : "Occitan",
        "oci_aran" : "Occitan(Aran.)",
        "por" : "Portuguese",
        "por_BR" : "Portuguese(Brazilian)",
        "por_PTpre1990" : "Portuguese(trad.)",
        "ron" : "Romanian",
        "srd" : "Sardinian",
        "ces_han" : "Czech(han.)",
        "fin" : "Finnish",
        "pol" : "Polish",
        "slk" : "Slovak",
        "tur" : "Turkish",
        "nno" : "Norwegian Nynorsk",
        "nob" : "Norwegian Bokmål",
        "swe" : "Swedish",
        "afr" : "Afrikaans",
        "ltz" : "Luxembourgish",
        "bul" : "Bulgarian",
        "nep" : "Nepali",
        "sin" : "Sinhala",
        "cat_iec2017" : "Catalan(iec2017)",
        "cat_valencia" : "Valencian",
        "ckb" : "Central Kurdish",
        "ell" : "Greek",
        "gle" : "Irish",
        "haw" : "Hawaiian",
        "hbs" : "Serbo-Croatian",
        "hbs_BS" : "Bosnian",
        "hbs_HR" : "Croatian",
        "hbs_SR" : "Serbian",
        "ibo" : "Igbo",
        "ind" : "Indonesian",
        "kaz" : "Kazakh",
        "kir" : "Kyrgyz",
        "kmr" : "Kurdish",
        "lat" : "Latin",
        "lin" : "Lingala",
        "lvs" : "Latvian",
        "sco" : "Scots",
        "srn" : "Sranan Tongo",
        "tam" : "Tamil",
        "tel" : "Telegu",
        "tha" : "Thai",
        "ces" : "Czech",
        "slv" : "Slovenian",
        "ssp" : "Spanish Sign Language",
        "sme" : "Northern Sami",
        "vro" : "Võro",
        "est" : "Estonian",
        "fkv" : "Kven Finnish",
        "hun" : "Hungarian",
        "isl" : "Icelandic",
        "krl" : "Karelian",
        "liv" : "Livonian",
        "myv" : "Erzya",
        "olo" : "Olonets Karelian",
        "smn" : "Inari Saami",
        "byv" : "Medumba",
        "frp" : "Arpitan",
        "gla" : "Gaelic",
        "hin" : "Hindi",
        "ara" : "Arabic",
        "guj" : "Gujurati",
        "kok" : "Konkani",
        "mar" : "Marathi",
        "pan_Arab" : "Punjabi(Arab)",
        "pan_Guru" : "Punjabi(Guru)",
        "snd" : "Sindhi",
        "urd" : "Urdu",
        "zlm" : "Malay",
        "uzb" : "Uzbek",
        "kaa" : "Karakalpak",
        "kum" : "Kumyk",
        "sah" : "Sakha",
        "tyv" : "Tuvinian",
        "uig" : "Uyghur",
        "bua" : "Buriat",
        "kpv" : "Komi-Zyrian",
        "koi" : "Komi-Permyak",
        "udm" : "Udmurt",
        "lav" : "Latvian",
        "kik" : "Kikuyu",
        "swa" : "Swahili",
        "lug" : "Ganda",
        "kan" : "Kannada",
        "sqi" : "Albanian",
        "mdf" : "Moksha",
        "nhi" : "Nahuatl",
        "nci" : "Classical Nahuatl",
        "nhi_SEP" : "Nahuatl(SEP)",
        "niv_Sakh" : "Nivkh(Sakhalin)",
        "niv_Amur" : "Nivkh(Amur)",
        "dan" : "Danish",
        "nno_e" : "Nynorsk(East)",
        "fao" : "Faroese",
        "csb" : "Kashubian",
        "szl" : "Silesian",
        "ukr" : "Ukrainian",
        "cos" : "Corsican",
        "fra_eco" : "Quebec French",
        "bel" : "Belarusian",
        "sma_Mid" : "Southern Saami(Mid)",
        "sma_North" : "Southern Saami(North)",
        "smj" : "Lule Saami",
        "ast" : "Asturian",
        "grn" : "Guarani",
        "ote" : "Hñähñu",
        "quz" : "Cusco Quechua",
        "qve" : "Quechua",
        "scn" : "Sicilian",
        "zho" : "Mandarin Chinese",
        "tlh" : "Klingon",
        "bak" : "Bashkir",
        "chv" : "Chuvash",
        "crh" : "Crimean Tatar",
        "tki" : "Iraqi Türkmen",
        "trw" : "Torwali",
        "zab_Simp" : "Dizhsa(Simp.)",
        "zab_Phon" : "Dizhsa(Phon.)",
        "select" : "Select"
    }
}

async function detectLanguage(text){
    text = text.replace(/\W/g, ' ')

    let url = new URL(getDetectLanguageEndpoint());
    let params = {q: text};
    url.search = new URLSearchParams(params).toString();

    let possibleLanguageList = await fetch(url)
        .then(response => response.json());

    let max = -Infinity, x, languageCode;
    for( x in possibleLanguageList) {
        if( possibleLanguageList[x] > max) {
            max = possibleLanguageList[x];
            languageCode = x;
        }
    }

    return languageCode;
}

// API EndPoints
function getLangPairsEndpoint() {
    return getGlobalSettings().apertiumSource + "listPairs";
}

function getTranslationEndpoint() {
    return getGlobalSettings().apertiumSource + "translate";
}

function getDetectLanguageEndpoint() {
    return getGlobalSettings().apertiumSource + "identifyLang"
}


// Enabled Website List
function getEnabledWebsiteList(){
    let settings = getGlobalSettings();
    return settings.enabledWebsites;
}

function saveEnabledWebsiteList(settings, newList) {
    if(newList === null) {
        return;
    }

    settings.enabledWebsites = newList;
    saveGlobalSettings(settings);
}

function removeFromEnabledWebsiteList(settings, hostname){
    let list = getEnabledWebsiteList();

    if(list.includes(hostname)) {
        let index = list.indexOf(hostname);
        if (index !== -1) {
            list.splice(index, 1);
        }
    }

    console.log(list);

    saveEnabledWebsiteList(settings, list);
}

function addToEnabledWebsiteList(settings, url) {
    let hostname = new URL(url).hostname;
    let list = getEnabledWebsiteList();

    if(!list.includes(hostname)) {
        list.push(hostname);
    }

    saveEnabledWebsiteList(settings, list);
}


// Source/Target Language Lists
function getSourceList() {
    let languageList = getLangPairs().langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].sourceLanguage);
    }
    return [...new Set(list)];
}

function getTargetList() {
    let languageList = getLangPairs().langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        list.push(languageList[i].targetLanguage);
    }
    return [...new Set(list)];
}

function getSourceWithTarget(target) {
    let languageList = getLangPairs().langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        if(languageList[i].targetLanguage === target) {
            list.push(languageList[i].sourceLanguage);
        }
    }
    return [...new Set(list)];
}

function getTargetwithSource(source) {
    let languageList = getLangPairs().langPairs;
    let list = [];
    for (let i = 0; i < languageList.length; i++) {
        if(languageList[i].sourceLanguage === source) {
            list.push(languageList[i].targetLanguage);
        }
    }
    return [...new Set(list)];
}