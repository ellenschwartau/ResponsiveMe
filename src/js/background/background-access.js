define([
    'extension'
],
/**
 * Dieses Skript kapselt den Zugriff auf Funktionen und Variablen der Hintergrundseite der Erweiterung.
 * @exports backgroundAccess
 * @param {module} extension - extensionModul
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
     * Liefert die Größe des Browsers
     * @param {boolean} includingBrowserOffset - Angabe, ob die Größe inklusive Browserabmessung gesucht wird
     * @returns {{width: int, height: int}}
     */
    var getBrowserSize = function(includingBrowserOffset){
        return includingBrowserOffset ? getOuterBrowserSize() : getInnerBrowserSize();
    };

    /**
     * Liefert die Breite des Browsers.
     * @param {boolean} includingBrowserOffset - Angabe, ob die Größe inklusive Browserabmessung gesucht wird
     * @returns {int}
     */
    var getBrowserWidth = function(includingBrowserOffset){
        return includingBrowserOffset ? background.outerBrowserWidth : background.innerBrowserWidth;
    };

    /**
     * Liefert die Höhe des Browsers.
     * @param {boolean} includingBrowserOffset - Angabe, ob die Größe inklusive Browserabmessung gesucht wird
     * @returns {int}
     */
    var getBrowserHeight = function(includingBrowserOffset){
        return includingBrowserOffset ? background.outerBrowserHeight : background.innerBrowserHeight;
    };

    /**
     * Liefert die erreichbare Browser-Größe.
     * @returns {{width: int, height: int}}
     */
    var getAvailBrowserSize = function(){
        return {
            width: background.availBrowserWidth,
            height: background.availBrowserHeight
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
        getBrowserHeight: getBrowserHeight,
        getBrowserWidth: getBrowserWidth,
        getBrowserSize: getBrowserSize,
        getOuterBrowserSize: getOuterBrowserSize,
        getInnerBrowserSize: getInnerBrowserSize,
        getAvailBrowserSize: getAvailBrowserSize
    };
});