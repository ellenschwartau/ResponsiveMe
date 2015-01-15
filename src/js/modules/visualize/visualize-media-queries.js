/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 */
define([
    'jquery', 'extension', 'config'
],
function($, extension, config) {
    var $contentWrapper,            // Parent Element des Modul-Inhalts
        $showMediaQueriesButton;    // Button zum Anzeigen der Media Queries

    /**
     * Initialisiert die Anzeige der Media Queries.
     */
    var initShowMediaQueries = function() {
        $showMediaQueriesButton.click(function(){
            extension.sendMessageToTab({
                type: config.messageTypes.showMediaQueries
            });
        });
    };

    /**
     * Zeigt die Media Queries an
     */
    var showMediaQueries = function() {
        console.log("Media Queries anzeigen.");
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        // TODO Konstante?
        $contentWrapper = $("#showMediaQueries");
        $showMediaQueriesButton = $("#showMediaQueriesButton");
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function() {
        initElements();
        initShowMediaQueries();
    };

    return {
        init: init,
        show: showMediaQueries
    };
});