/**
 * Skript zur Prüfung, ob bestimmte Media Queries greifen, oder nicht.
 */
define([

], function(){
    /**
     * Liefert die Information, ob eine aktuelle Media-Angabe zutrifft.
     * @param {string} media - Media Query
     * @returns {boolean}
     */
    var matches = function(media) {
        return window.matchMedia(media).matches;
    };

    return {
        matches: matches
    }
});