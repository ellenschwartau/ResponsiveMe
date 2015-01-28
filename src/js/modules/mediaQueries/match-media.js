define([
    'stylesheetParser'
],
/**
 * Skript zur Prüfung, ob bestimmte Media Queries greifen, oder nicht.
 * @exports matchMedia
 * @param {module} stylesheetParser - stylesheetParser-Modul
 * @see module:stylesheetParser
 * @returns {{matches: Function}}
 */
function(stylesheetParser){
    /**
     * Liefert die aktuell zutreffenden Media-Angaben.
     */
    var getMatchedMedia = function() {
        var matchedMediaList = [],
            mediaList = stylesheetParser.getMediaList();
        $.each(mediaList, function(i, media){
            if(matches(media)){
                matchedMediaList.push(media);
            }
        });
        return matchedMediaList;
    };

    /**
     * Liefert die Information, ob eine aktuelle Media-Angabe zutrifft.
     * @param {string} media - Media Query
     * @returns {boolean}
     */
    var matches = function(media) {
        return window.matchMedia(media).matches;
    };

    return {
        getMatchedMedia: getMatchedMedia
    }
});