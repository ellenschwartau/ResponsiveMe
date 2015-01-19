/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 * Behandelt die Messages und führt die gewünschten Aktionen aus.
 */
require([
    'jquery', 'extension', 'visualizeElements', 'config', 'mediaQueries'
],
function($, extension, visualizeElements, config, mediaQueries) {
    /**
     * Zeigt die gewünschten Elemente auf der Seite an.
     * @param request
     * @param sender
     * @param sendResponse
     */
    var handleShowElements = function(request, sender, sendResponse) {
        visualizeElements.show(request.data.selectors, request.data.color, request.data.width);
    };

    /**
     * Liest die Media Queries aus den Style Sheets aus.
     * @param request
     * @param sender
     * @param sendResponse
     */
    var handleShowMediaQueries = function(request, sender, sendResponse) {
        sendResponse({
            data: mediaQueries.get()
        });
    };


    /**
     * Behandelt die Nachrichten, die an das Content Script gedenset werden.
     * @param request
     * @param sender
     * @param sendResponse  function
     */
    var handleMessages = function(request, sender, sendResponse) {
        // Nur eine Antwort kann pro document gesendet werden
        // deswegen muss die Unterscheidung des Types hier passieren
        // nicht erst in der extension.handleMessage Methode
        switch(request.type) {
            case config.messageTypes.showElements:
                handleShowElements(request, sender, sendResponse);
                break;
            case config.messageTypes.showMediaQueries:
                handleShowMediaQueries(request, sender, sendResponse);
                break;
        }
    };

    extension.handleMessage(handleMessages);


    // TODO was davon richtig?
    //extension.handleMessage(config.messageTypes.showGrid, handleShowGrid);
    //extension.handleMessage(config.messageTypes.showMediaQueries, handleShowMediaQueries);

    // TODO Anzeige IST-Zustand
    // TODO Info bei Browseränderung
});
