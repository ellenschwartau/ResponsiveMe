/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 */
define([
    'jquery'
],
function($) {
    var $contentWrapper;    // Parent Element des Modul-Inhalts

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        // TODO Konstante?
        $contentWrapper = $("#showMediaQueries");
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function() {
        initElements();
    };

    return {
        init: init
    };
});