define([
],
/**
 * Kapselt Funktionen zum Auslesen bestimmter Bestandteile oder Ausführen von
 * Operationen auf bestimmten Komponenten der Erweiterung.
 * @exports extensionComponents
 * @returns {{getBackgroundPage: Function, getCurrentWindow: Function, executeScriptCodeInTab: Function}}
 */
function(){
    /**
     * Liefert die Hintergrundseite der Erweiterung.
     * @returns {*}
     */
    var getBackgroundPage = function(){
        return chrome.extension.getBackgroundPage();
    };

    /**
     * Liest das aktuelle Browserfenster aus und reicht dieses als Parameter an die übergebene Funktion weiter.
     * @param {function} callback - Funktion, die Operationen auf dem aktuellen Fenster ausführt. Erhält das Fenster als Parameter.
     */
    var getCurrentWindow = function(callback){
        chrome.windows.getCurrent(callback);
    };

    /**
     * Führt Javascript auf der geöffneten Seite aus.
     * @param {string} code - Code, der ausgeführt werden soll
     * @param {function} callback - Funktion, die das Ergebnis verarbeitet. Erhält das letzte Ergebnis als Parameter.
     */
    var executeScriptCodeInTab = function(code, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(tabs[0].id, {code: code}, callback);
        });
    };

    return {
        getBackgroundPage: getBackgroundPage,
        getCurrentWindow: getCurrentWindow,
        executeScriptCodeInTab: executeScriptCodeInTab
    };
});