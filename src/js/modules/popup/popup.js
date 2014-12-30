/**
 * Javascript der popup.html - initialisiert das Popup.
 * Die verfügbaren Module werden geladen und die Settings initialisiert.
 *
 * // TODO ausschließen, dass das html einer anderen Website beeinflusst wird
 *
 */
define(
    ['jquery', 'modules', 'settings']
    ,
function($, modules, settings) {
    /** Wrapper-Element, für den Inhalt des Popups */
    var $content = $("#popup-content");

    /**
     * Initialisiert das Popup.
     * Dafür werden die verschiedenen Module in das Popup eingebunden
     * und die Callbacks zur Manipulation der Anzeige gesetzt.
     */
    var init = function () {
        $(document).ready(function () {
            modules.init($content);
            settings.init();
        });
    };

    return {
        init: init
    };
});