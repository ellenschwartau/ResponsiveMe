/**
 * Javascript der popup.html - initialisiert das Popup.
 * Die verfügbaren Module werden geladen und die Settings initialisiert.
 *
 */
define([
    'jquery', 'modules', 'settings'
],
function($, modules, settings) {
    /**
     * Initialisiert das Minimieren und Maximieren des Popups,
     * wenn die Maus auf das Popup oder vom Popup weg bewegt wird.
     */
    var initPopupDisplay = function() {
        var $body = $("body");
        $body.mouseleave(function(){
            $(this).addClass("hide");
        });
        $body.mouseenter(function(){
            $("body").removeClass("hide");
        });
    };

    /**
     * Initialisiert das Popup.
     * Dafür werden die verschiedenen Module in das Popup eingebunden
     * und die Callbacks zur Manipulation der Anzeige gesetzt.
     */
    var init = function () {
        var $content = $("#popup-content");
        modules.init($content);
        settings.init();
        initPopupDisplay();
    };

    return {
        init: init
    };
});