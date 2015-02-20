define([],
/**
 * Kapselt Funktionen zur Umsetzung des Message Passing.
 * @exports extensionMessagePassing
 * @returns {{sendMessageToTab: Function, sendMessage: Function, handleMessage: Function, messafeTypes: json}}
 */
function(){
    /**
     * Typen, zur Identigikation der Nachrichten, die zwischen den Komponenten der Erweiterung verschickt werden.
     * @type {{showElements: string, showMediaQueries: string, windowResize: string, updateStyle: string, insertStyle: string, deleteStyle: string, displayCurrentMediaList: string, updateBrowserSize: string, updateAvailBrowserSize: string, updateBackgroundPage: string, updateActiveMediaQueries: string}}
     */
    var messageTypes = {
        showElements: "showElements",
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
     * Versendet eine Nachricht mit den spezifizierten Daten.
     * @param {json} data - Daten, die übergeben werden sollen
     */
    var sendMessage = function(data) {
        chrome.runtime.sendMessage(data);
    };

    /**
     * Sendet eine Nachricht an den aktiven Tab und kann optional eine Funktion zur Verarbeitung der Antwort ausführen.
     * @param {json} data - Daten, die übergeben werden sollen
     * @param {function} [responseCallback] - optionale Funktion, die die Response verarbeitet
     */
    var sendMessageToTab = function(data, responseCallback) {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, data, responseCallback);
        });
    };

    /**
     * Behandelt die Nachricht eines bestimmten Typs und führt eine entsprechende Aktion aus.
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