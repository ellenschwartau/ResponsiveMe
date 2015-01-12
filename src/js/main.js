/**
 * Die main.js übernimmt das Laden und Initialisieren der Module.
 */
require([
    'popup'
],
function(popup) {
    popup.init();
});