/**
 * Die main.js übernimmt das Laden und Initialisieren der verschiedenen Module.
 */
require.config({
    // Basispfad der Javaskript Dateien
    baseUrl: '/js',
    // Vorhandene Module und Libs
    paths: {
        jquery: 'libs/jquery-1.11.2.min',
        config: 'modules/config',
        // Popup
        popup: 'popup/popup',
        modules: 'popup/module',
        settings: 'popup/settings',
        // Viewport
        viewport: 'modules/viewport/viewport',
        viewportAnimation: 'modules/viewport/viewport-animation',
        viewportSize: 'modules/viewport/viewport-size',
        browserOffset: 'modules/viewport/browser-offset',
        // Visualisierung
        visualize: 'modules/visualize/visualize'
    }
});

require([
    'jquery', 'popup', 'viewport', 'visualize'
],
function($, popup, viewport, visualize) {
    // javascript initialisieren
    $.each([
        popup, viewport, visualize
    ], function(i, item) {
       item.init();
    });
});