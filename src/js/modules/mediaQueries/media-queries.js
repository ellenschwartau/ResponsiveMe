/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 * Es liest die in den Style Sheets der aufgerufenen Website enthaltenen Media Queries aus und bringt diese zur Anzeige.
 * Über einen Mausklick auf den Selektor der Media Query kann anschließend an die Stelle gesprungen werden,
 * an der diese Media Query greift.
 */
define([
    'jquery', 'showMediaQueries', 'newMediaQuery', 'config', 'extension'
],
function($, showMediaQueries, newMediaQuery, config, extension) {
    var $showMediaQueriesButton,                        // Button zum Anzeigen der Media Queries
        $newMediaQueryButton,                           // Button zum Speichern der neuen Media Query
        EDITOR_ID_NEW_MEDIA_QUERY = "newMediaQuery";        // ID des Editors zum verfassen einer neuen Media Query

    /**
     * Initialisiert die Anzeige der Media Queries.
     */
    var initMediaQueryDisplay = function() {
        $showMediaQueriesButton.click(function(){
            // Media Queries von Content Script abfragen
            extension.sendMessageToTabWithCb({
                    type: config.messageTypes.showMediaQueries
                },
                // erhaltene Antwort verarbeiten und Media Queries anzeigen
                showMediaQueries.show
            );
        });
    };

    /**
     * Initialisiert die Funktionalität zum Erstellen einer neuen Media Query.
     */
    var initNewMediaQuery = function() {
        $newMediaQueryButton.click(function() {
            newMediaQuery.save(EDITOR_ID_NEW_MEDIA_QUERY);
        });
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        $showMediaQueriesButton = $("#showMediaQueriesButton");
        $newMediaQueryButton = $("#newMediaQueriesButton");
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function() {
        initElements();
        initMediaQueryDisplay();
        initNewMediaQuery();
        newMediaQuery.init(EDITOR_ID_NEW_MEDIA_QUERY);
        showMediaQueries.init();
    };

    return {
        init: init,
        get: showMediaQueries.get
    };
});