/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 */
require(
    ['jquery', 'extension']
,
    function($, extension) {
        var handleShowGrid = function() {
            console.log("Test");
        };

        extension.handleMessage("showGrid", handleShowGrid());

        // Anzeige IST-Zustand
        // Info bei Browseränderung
});
