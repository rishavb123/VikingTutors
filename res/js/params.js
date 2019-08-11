function getUrlParameters() {
    return getUrlParametersFromUrl(window.location.href);
}

function getUrlParametersFromUrl(url) {
    let vars = {};
    url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}