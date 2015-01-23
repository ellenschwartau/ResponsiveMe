/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 * Es bringt die aktuell vorhandenen Media Queries zur Anzeige und bietet außerdem die Möglichkeit,
 * die vorhandenen Media Queries zu bearbeiten und neue Hinzuzufügen.
 * Auch die aktuell greifenden Media Queries werden aufgelistet.
 */
define([
    'jquery', 'showMediaQueries', 'newMediaQuery', 'config', 'extension'
],
function($, showMediaQueries, newMediaQuery, config, extension) {
    var $showMediaQueriesButton,                        // Button zum Anzeigen der Media Queries
        $newMediaQueryButton,                           // Button zum Speichern der neuen Media Query
        EDITOR_ID_NEW_MEDIA_QUERY = "newMediaQuery";    // ID des Editors zum verfassen einer neuen Media Query

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