let enabledList;

chrome.runtime.sendMessage({method: "getEnabledList"}, function (response) {
    enabledList = response.list;
    addHoverElements();
});

function addHoverElements() {
    if (enabledList.includes(window.location.hostname)) {
        addHoverTag();
    }
}

