/**
 * Die main.js übernimmt das Laden und Initialisieren der verschiedenen Module.
 */
require.config({
    // Basispfad der Javaskript Dateien
    baseUrl: '/js',
    // Vorhandene Module und Libs
    paths: {
        jquery: 'libs/jquery-1.11.2.min',
        popup: 'modules/popup/popup',
        modules: 'modules/popup/module',
        settings: 'modules/popup/settings',
        viewport: 'modules/viewport/viewport'
    }
});

require(
    ['jquery', 'popup', 'viewport']
,
function($, popup, viewport) {
    // javascript initialisieren
    $.each([
        popup
    ], function(i, item) {
       item.init();
    });
});