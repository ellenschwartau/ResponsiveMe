require([
    'jquery', 'matchMedia', 'extension', 'config'
],
/**
 * Content Script zur Verarbeitung der aktuellen Media Angaben.
 * @exports csMediaQueries
 * @param {Object} $ - JQuery
 * @param {module} matchMedia - matchMedia-Modul
 * @see module:matchMedia
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 */
function($, matchMedia, extension, config){
    /**
     * Berechnet bei Skalierung des Browsers die zutreffenden Media Angaben aus den Media Queries.
     */
    var updateMatchedMediaOnResize = function(){
        $(window).resize(function(){
            updateMediaList();
        });
    };

    /**
     * Berechnet die aktuell greifenden Media Angaben und triggert die Aktualisierung in Background Page und Popup.
     */
    var updateMediaList = function() {
        extension.sendMessage({
            type: config.messageTypes.displayCurrentMediaList,
            data: {
                mediaList: matchMedia.getMatchedMedia()
            }
        });
    };

    /**
     * Initialisiert die Ermittlung der aktuell greifenden Media-Angaben.
     */
    var init = function(){
        updateMediaList();
        updateMatchedMediaOnResize();
    }();
});
