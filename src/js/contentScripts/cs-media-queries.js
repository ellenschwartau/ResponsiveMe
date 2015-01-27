require([
    'jquery', 'matchMedia', 'stylesheetParser', 'extension', 'config'
],
/**
 * Content Script zur Verarbeitung der aktuellen Media Angaben.
 * @exports csMediaQueries
 * @param {Object} $ - JQuery
 * @param {module} matchMedia - matchMedia-Modul
 * @see module:matchMedia
 * @param {module} stylesheetParser - stylesheetParser-Modul
 * @see module:stylesheetParser
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 */
function($, matchMedia, stylesheetParser, extension, config){
    var mediaList;      // Liste der Media-Angaben innerhalb der Media Queries
                        // werden einmal bei Seitenaufruf initialisiert und können
                        // über Message Passing aktualisiert werden
    // TODO über Message Passing aktualisierbar machen

    /**
     * Liefert die Media Angaben, die innerhalb der Media Queries vorhanden sind.
     * @returns {string[]}
     */
    var getMediaList = function() {
        return stylesheetParser.getMediaList();
    };

    /**
     * Liefert die aktuell zutreffenden Media-Angaben.
     */
    var getMatchedMedia = function() {
        var matchedMediaList = [];
        $.each(mediaList, function(i, media){
            if(matchMedia.matches(media)){
                matchedMediaList.push(media);
            }
        });
        return matchedMediaList;
    };
    // TODO Funktion in matchMedia Modul auslagern

    /**
     * Berechnet bei Skalierung des Browsers die zutreffenden Media Angaben aus den Media Queries.
     */
    var calcMatchedMediaOnResize = function(){
        $(window).resize(function(){
            var matchedMediaList = getMatchedMedia();
            console.log("Gesamte Media Angaben: " + mediaList);
            console.log("Greifende Media Angaben: " + matchedMediaList);
            extension.sendMessage({
                type: config.messageTypes.displayCurrentMediaList,
                data: {
                    mediaList: matchedMediaList
                }
            })
        });
    };

    /**
     * Initialisiert die Ermittlung der aktuell greifenden Media-Angaben.
     */
    var init = function(){
        mediaList = getMediaList();
        calcMatchedMediaOnResize();
    };

    init();
});
