/**
 * Modul zur Visualisierung von Grids und Media Queries.
 */
define([
    'jquery', 'extension', 'grid', 'mediaQueries'
],
function($, extension, grid, mediaQueries){
    /**
     * Initialisiert das Visualize-Modul.
     */
    return {
        init: function() {
                grid.init();
                mediaQueries.init();
            }
    }
});
