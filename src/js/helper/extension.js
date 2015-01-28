define([
],
/**
 * Stellt verschiedene Funktionen bereit, um zwischen Browser und Erweiterung zu kommunizieren.
 * Dient als Wrapper-Modul für die Funktionalitäten die die chrome.*-API bereitstellt.
 * @exports extension
 */
function(){
    /**
     * Sendet eine Nachricht an den aktiven Tab und führt eine Funktion aus, wenn eine Response zurück kommt.
     * @param {json} data - Daten, die übergeben werden sollen
     * @param {function} responseCallback - Funktion, die auf der Response ausgeführt werden soll
     */
    var sendMessageToTabWithCb = function(data, responseCallback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(
                tabs[0].id,
                data,
                function(response) {
                    responseCallback(response);
                }
            )
        });
    };

    /**
     * Sendet eine Nachricht an den aktiven Tab.
     * @param {json} data - Daten, die übergeben werden sollen
     */
    var sendMessageToTab = function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data)
        });
    };

    /**
     * Sendet eine Nachricht mit den übergebenen Daten.
     * @param {json} data - Daten, die übergeben werden sollen
     */
    var sendMessage = function(data) {
        chrome.runtime.sendMessage(data);
    };

    /**
     * Behandelt eines Message des Types type und führt eine entsprechende Aktion aus.
     * @param {string} type - Typ der Nachricht
     * @param {function} action - Funktion, die ausgeführt werden soll
     * // TODO Doku
     */
    var handleMessage = function(type, action) {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(type === request.type) {
                    action(request, sender, sendResponse);
                }
            });
    };

    /**
     * Führt Javascript auf der geöffneten Seite aus.
     * @param {string} code - Code, der ausgeführt werden soll
     * @param {function} callback - Funktion, die das Ergebnis verarbeitet
     */
    var executeScriptCode = function(code, callback) {
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

    /**
     * Liefert die Hintergrundseite der Erweiterung.
     * //TODO DOku
     * @returns {*}
     */
    var getBackgroundPage = function(){
        return chrome.extension.getBackgroundPage();
    };

    return {
        sendMessage: sendMessage,
        sendMessageToTab: sendMessageToTab,
        sendMessageToTabWithCb: sendMessageToTabWithCb,
        handleMessage: handleMessage,
        executeScriptCode: executeScriptCode,
        getBackgroundPage: getBackgroundPage
    };
});