/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 * Behandelt die Messages und führt die gewünschten Aktionen aus.
 */
require([
    'jquery', 'extension', 'config', 'visualize'
],
function($, extension, config, visualize) {
    var handleShowGrid = function(request, sender, sendResponse) {
        visualize.showGrid(request.selectors, request.color, request.width);
    };

    var handleShowMediaQueries = function(request, sender, sendResponse) {
        visualize.showMediaQueries();
    };

    extension.handleMessage(config.messageTypes.showGrid, handleShowGrid);

    extension.handleMessage(config.messageTypes.showMediaQueries, handleShowMediaQueries);

    // Anzeige IST-Zustand
    // Info bei Browseränderung
});
