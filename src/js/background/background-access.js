define([
    'extension'
],
/**
 * Dieses Skript kapselt den Zugriff auf Funktionen und Variablen der Hintergrundseite der Erweiterung.
 * @exports backgroundAccess
 * @param extension
 * @see module:extension
 * @returns {{getMediaList: Function, getOuterBrowserSize: Function, getInnerBrowserSize: Function}}
 */
function(extension){
    /**
     * Hintergrundseite
     */
    var background = extension.getBackgroundPage();

    /**
     * Liefert die outer Browser-Größe, inklusive Elementen wie Toolbar oder Scrollbar.
     * @returns {{width: *, height: *}}
     */
    var getOuterBrowserSize = function(){
        return {
            width: background.outerBrowserWidth,
            height: background.outerBrowserHeight
        }
    };

    /**
     * Liefert die inner Browser-Größe, ohne Elemente wie Toolbar oder Scrollbar.
     * @returns {{width: *, height: *}}
     */
    var getInnerBrowserSize = function(){
        return {
            width: background.innerBrowserWidth,
            height: background.innerBrowserHeight
        }
    };

    /**
     * Liefert die Liste der greifenden Media Angaben.
     * @returns {Array}
     */
    var getMediaList = function(){
        return background.mediaList;
    };

    return {
        getMediaList: getMediaList,
        getOuterBrowserSize: getOuterBrowserSize,
        getInnerBrowserSize: getInnerBrowserSize
    };
});