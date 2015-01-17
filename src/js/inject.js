/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 * Behandelt die Messages und führt die gewünschten Aktionen aus.
 */
require([
    'jquery', 'extension', 'config', 'visualize'
],
function($, extension, config, visualize) {

    var handleMessages = function(request, sender, sendResponse) {
        // Nur eine Antwort kann pro document gesendet werden
        // deswegen muss die Unterscheidung des Types hier passieren
        // nicht erst in der extension.handleMessage Methode
        switch(request.type) {
            case config.messageTypes.showGrid:
                handleShowGrid(request, sender, sendResponse);
                break;
            case config.messageTypes.showMediaQueries:
                handleShowMediaQueries(request, sender, sendResponse);
                break;
        }
    };

    var handleShowGrid = function(request, sender, sendResponse) {
        visualize.showGrid(request.data.selectors, request.data.color, request.data.width);
        // TODO DOku: Request immer ein type und ein data Attribut
    };

    var handleShowMediaQueries = function(request, sender, sendResponse) {
        sendResponse({
            data: visualize.getMediaQueries()
        });
    };

    // TODO was davon richtig?
    //extension.handleMessage(config.messageTypes.showGrid, handleShowGrid);
    //extension.handleMessage(config.messageTypes.showMediaQueries, handleShowMediaQueries);

    extension.handleMessage(handleMessages);

    // Anzeige IST-Zustand
    // Info bei Browseränderung
});
