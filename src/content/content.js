enabledList = getEnabledWebsiteList();

if(enabledList.includes(window.location.hostname)) {
    addHoverTag();
}

