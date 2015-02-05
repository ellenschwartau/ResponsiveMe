define([
],
/**
 * Kapselt Funktionen zum Auslesen oder Ausführen von Operationen auf bestimmten Komponenten der Erweiterung.
 * @exports extensionComponents
 * @returns {{getBackgroundPage: Function, getCurrentWindow: Function}}
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
     * Liest das aktuelle Fenster aus und reicht dieses als Parameter
     * an die übergebene Funktion weiter.
     * @param {function} callback - Funktion, die Operationen auf dem aktuellen Fenster aufruft
     */
    var getCurrentWindow = function(callback){
        chrome.windows.getCurrent(function(window) {
            callback(window);
        });
    };

    /**
     * Führt Javascript auf der geöffneten Seite aus.
     * @param {string} code - Code, der ausgeführt werden soll
     * @param {function} callback - Funktion, die das Ergebnis verarbeitet
     * // TODO Doku Tab noch null?
     */
    var executeScriptCodeInTab = function(code, callback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.executeScript(
                tabs[0].id,
                {code: code},
                function(results){
                    callback(results);
                }
            );
        });
    };

    return {
        getBackgroundPage: getBackgroundPage,
        getCurrentWindow: getCurrentWindow,
        executeScriptCodeInTab: executeScriptCodeInTab
    };
});