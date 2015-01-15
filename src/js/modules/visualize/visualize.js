/**
 * Modul zur Visualisierung von Grids und Media Queries.
 * Initialisiert die Hilfs-Module und liegert den Zugriff auf die Hautpfunktionen.
 *
 * TODO Doku: Schnittstelle zu den Hilfsmodulen, inject.js braucht dann nur dieses Obermodul um Funktionen aufzurufen
 * statt zwei. --> Schlankere Schnittstelle, Einfache Erweiterung (Facade)
 */
define([
    'jquery', 'extension', 'grid', 'mediaQueries'
],
function($, extension, grid, mediaQueries){
    /**
     * Zeigt da Grid, das durch die Selektoren definiert wird, in der übergebenen Farbe und Pixelbreite an.
     * @param selectors [String]    Selektoren, die das Grid definieren
     * @param color     String      Farbe
     * @param width     int         Breite
     */
    var showGrid = function(selectors, color, width) {
        grid.show(selectors, color, width);
    };

    /**
     * Zeigt die Media Queries über das Hilfsmodul an.
     */
    var showMediaQueries = function() {
        mediaQueries.show();
    };

    /**
     * Initialisiert das Visualize-Modul und dessen Hilfs-Module.
     */
    var init = function() {
        grid.init();
        mediaQueries.init();
    };

    return {
        init: init,
        showGrid: showGrid,
        showMediaQueries: showMediaQueries
    }
});
