define([],
/**
 * Kapselt Funktionen der Erweiterung zur Umsetzung des Message Passing.
 * @exports extensionMessagePassing
 * @returns {{sendMessageToTabWithCb: Function, sendMessageToTab: Function, sendMessage: Function, handleMessage: Function}}
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
        sendMessageToTabWithCb: sendMessageToTabWithCb,
        sendMessageToTab: sendMessageToTab,
        sendMessage: sendMessage,
        handleMessage: handleMessage
    };
});