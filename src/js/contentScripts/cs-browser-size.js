require([
    'jquery', 'extension', 'config'
],
/**
 * Content Script zur Ermittlung der aktuellen Browsergröße.
 * @exports csBrowserSize
 * @param {Object} $ - JQuery
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 */
function($, extension, config){
    /**
     * Berechnet bei Skalierung des Browsers die zutreffenden Media Angaben aus den Media Queries.
     */
    var updateBrowserSizeOnResize = function(){
        $(window).resize(function(){
            updateBrowserSize();
        });
    };

    /**
     * Berechnet die aktuell greifenden Media Angaben und triggert die Aktualisierung in Background Page und Popup.
     */
    var updateBrowserSize = function() {
        extension.sendMessage({
            type: config.messageTypes.updateBrowserSize,
            data: {
                innerBrowserHeight: window.innerHeight,
                outerBrowserHeight: window.outerHeight,
                innerBrowserWidth: window.innerWidth,
                outerBrowserWidth: window.outerWidth
            }
        });
    };

    /**
     * Triggert das Aktualisieren der möglichen Browser-Größe.
     */
    var updateAvailBrowserSize = function(){
        extension.sendMessage({
            type: config.messageTypes.updateAvailBrowserSize,
            data: {
                availBrowserHeight: window.screen.availHeight,
                availBrowserWidth: window.screen.availWidth
            }
        });
    };

    /**
     * Initialisiert die Ermittlung der aktuell greifenden Media-Angaben.
     */
    var init = function(){
        updateBrowserSize();
        updateBrowserSizeOnResize();
        updateAvailBrowserSize();
    }();
});