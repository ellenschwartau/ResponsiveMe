define([],
/**
 * Kapselt Funktionen der Erweiterung zur Umsetzung des Message Passing.
 * @exports extensionMessagePassing
 * @returns {{sendMessageToTab: Function, sendMessage: Function, handleMessage: Function}}
 */
function(){
    var messageTypes = {                            // Type, zur Identifikation der Nachrichten, die zwischen
        showElements: "showElements",               // den Komponenten der Erweiterung verschickt werden
        showMediaQueries: "showMediaQueries",
        windowResize: "windowResize",
        updateStyle: "updateStyle",
        insertStyle: "insertStyle",
        deleteStyle: "deleteStyle",
        displayCurrentMediaList: "displayCurrentMediaList",
        updateBrowserSize: "updateBrowserSize",
        updateAvailBrowserSize: "updateAvailBrowserSize",
        updateBackgroundPage: "updateBackgroundPage",
        updateActiveMediaQueries: "updateActiveMediaQueries"
    };

    /**
     * Sendet eine Nachricht mit den übergebenen Daten.
     * @param {json} data - Daten, die übergeben werden sollen
     */
    var sendMessage = function(data) {
        chrome.runtime.sendMessage(data);
    };

    /**
     * Sendet eine Nachricht an den aktiven Tab und kann optional eine Funktion ausführen,
     * wenn eine Antwort geliefert wird.
     * @param {json} data - Daten, die übergeben werden sollen
     * @param {function} [responseCallback] - optionale Funktion, die die Response verarbeitet
     */
    var sendMessageToTab = function(data, responseCallback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if(responseCallback){
                chrome.tabs.sendMessage(tabs[0].id, data, responseCallback);
            } else {
                chrome.tabs.sendMessage(tabs[0].id, data);
            }
        });
    };

    /**
     * Behandelt eines Message des Types type und führt eine entsprechende Aktion aus.
     * @param {string} type - Typ der Nachricht
     * @param {function} action - Funktion, die ausgeführt werden soll
     */
    var handleMessage = function(type, action) {
        chrome.runtime.onMessage.addListener(
            function(request, sender, sendResponse) {
                if(type === request.type) {
                    action(request, sender, sendResponse);
                }
            });
    };

    return {
        sendMessageToTab: sendMessageToTab,
        sendMessage: sendMessage,
        handleMessage: handleMessage,
        messageTypes: messageTypes
    };
});