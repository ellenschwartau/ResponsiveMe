/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 */
require([
    'jquery', 'extension', 'config'
],
function($, extension, config) {
    var handleShowGrid = function() {
        console.log("Grid Anzeigen");
    };

    var handleShowMediaQueries = function() {
        console.log("Media Queries anzeigen.")
    };

    extension.handleMessage(config.messageTypes.showGrid, handleShowGrid);

    extension.handleMessage(config.messageTypes.showMediaQueries, handleShowMediaQueries);

    // Anzeige IST-Zustand
    // Info bei Browseränderung
});
