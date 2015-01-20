/**
 * Sorgt dafür, dass die Skripte von Websites richtig geladen werden.
 * @param context
 * @param moduleName
 * @param url
 */
require.load = function(context, moduleName, url) {
    var request = new XMLHttpRequest();
    request.open("GET", chrome.extension.getURL(url) + "?r=" + (new Date()).getTime(), true);
    request.onreadystatechange = function(e) {
        // Request ist abgeschlossen und Status OK
        if(request.readyState === 4 && request.status === 200) {
            eval(request.responseText);
            context.completeLoad(moduleName);
        }
    };
    request.send(null);
};