/**
 * Stellt verschiedene Funktionen bereit, um zwischen Browser und Erweiterung zu kommunizieren.
 * Dient als Wrapper-Modul für die Funktionalitäten die die chrome.*-API bereitstellt.
 */
define([

],
function(){
    /**
     * Sendet eine Nachricht an den aktiven Tab und führt eine Funktion aus, wenn eine Response zurück kommt.
     * @param data              JSON        Daten, die übergeben werden sollen
     * @param responseCallback  function    Funktion, die auf der Response ausgeführt werden soll
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
     * @param data  JSON    Daten, die übergeben werden sollen
     */
    var sendMessageToTab = function(data) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data)
        });
    };

    /**
     * Sendet eine Nachricht mit den übergebenen Daten.
     * @param data JSON
     */
    var sendMessage = function(data) {
        chrome.runtime.sendMessage(data);
    };

    /**
     * Behandelt eines Message des Types type und führt eine entsprechende Aktion aus.
     * @param type      String      Type der Message
     * @param action    function    Funktion, die ausgeführt werden soll
     */
    //var handleMessage = function(type, action) {
    //    chrome.runtime.onMessage.addListener(
    //        function(request, sender, sendResponse) {
    //            if (request.type == type)
    //                action(request, sender, sendResponse);
    //        });
    //};

    /**
     * Behandelt eines Message des Types type und führt eine entsprechende Aktion aus.
     * @param action    function    Funktion, die ausgeführt werden soll
     */
    var handleMessage = function(action) {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                action(request, sender, sendResponse);
            });
    };

    /**
     * Führt Javascript auf der geöffneten Seite aus.
     * @param code      String      Code, der ausgeführt werden soll
     * @param callback  function    Funktion, die das Ergebnis verarbeitet
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

    return {
        sendMessage: sendMessage,
        sendMessageToTab: sendMessageToTab,
        sendMessageToTabWithCb: sendMessageToTabWithCb,
        handleMessage: handleMessage,
        executeScriptCode: executeScriptCode
    };
});