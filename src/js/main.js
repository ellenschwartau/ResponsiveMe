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
        popup: 'popup/popup',
        modules: 'popup/module',
        settings: 'popup/settings',
        viewport: 'modules/viewport/viewport',
        viewportAnimation: 'modules/viewport/viewport-animation',
        viewportSize: 'modules/viewport/viewport-size',
        browserOffset: 'modules/viewport/browser-offset'
    }
});

require(
    ['jquery', 'popup', 'viewport']
,
function($, popup, viewport) {
    // javascript initialisieren
    $.each([
        popup, viewport
    ], function(i, item) {
       item.init();
    });
});