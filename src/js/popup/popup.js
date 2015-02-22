define([
    'jquery', 'modules', 'settings'
],
/**
 * Modul zur Initialisierung des Popups.
 * Lädt die verfügbaren Module und initialisiert die Settings.
 * @exports popup
 * @param {Object} $ - JQuery
 * @param {module} modules - modules-Modul
 * @see module:modules
 * @param {module} settings - settings-Modul
 * @see module:settings
 * @returns {{init: Function}}
 */
function($, modules, settings) {
    /**
     * CSS-Klasse zur Minimierung des Popups.
     * @type {string}
     */
    var HIDE_POPUP_CLASS = "hide";
    /**
     * Initialisiert das Minimieren und Maximieren des Popups,
     * wenn die Maus auf das Popup oder vom Popup weg bewegt wird.
     */
    var initPopupDisplay = function() {
        var $body = $("body");
        $body.mouseleave(function(){
            $(this).addClass("HIDE_POPUP_CLASS");
        });
        $body.mouseenter(function(){
            $(this).removeClass("HIDE_POPUP_CLASS");
        });
    };

    /**
     * Initialisiert das Popup.
     * Dafür werden die verschiedenen Module in das Popup eingebunden
     * und die Callbacks zur Manipulation der Anzeige durch die Settings gesetzt.
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