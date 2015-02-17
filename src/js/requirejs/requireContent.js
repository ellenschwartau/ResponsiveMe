/**
 * Sorgt dafür, dass die Skripte von Websites richtig geladen werden.
 * @param {Object} context - Enthält Informationen zum Kontext, wie beispielsweise die geladene RequireJS Konfiguration
 * @param {string} moduleName - Name des Moduls
 * @param {string} url - URL zum Modul
 */
require.load = function(context, moduleName, url) {
    var request = new XMLHttpRequest();
    // URL zum Modul ausgehend von der Erweiterung abfragen
    request.open("GET", chrome.extension.getURL(url) + "?r=" + (new Date()).getTime(), true);
    request.onreadystatechange = function() {
        // Request ist abgeschlossen und Status OK
        if(request.readyState === 4 && request.status === 200) {
            eval(request.responseText);
            context.completeLoad(moduleName);
        }
    };
    request.send(null);
};