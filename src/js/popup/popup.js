/**
 * Javascript der popup.html - initialisiert das Popup.
 * Die verfügbaren Module werden geladen und die Settings initialisiert.
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
        modules.init($content);
        settings.init();
        $("body").mouseleave(function(){
            $(this).addClass("hide");
        });
        $("body").mouseenter(function(){
            $("body").removeClass("hide");
        });
    };

    return {
        init: init
    };
});