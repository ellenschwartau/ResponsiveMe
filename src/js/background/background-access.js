define([
    'extension'
],
/**
 * Dieses Skript kapselt den Zugriff auf Funktionen und Variablen der Hintergrundseite.
 * @exports backgroundAccess
 * @param {module} extension - extensionModul
 * @see module:extension
 * @returns {{getMediaList: Function, getBrowserHeight: Function, getBrowserWidth: Function, getBrowserSize: Function, getAvailBrowserSize: Function, getBrowserOffset: Function}}
 */
function(extension){
    /**
     * Hintergrundseite
     */
    var background = extension.getBackgroundPage();

    /**
     * Liefert die äußere Browsergröße, inklusive Elementen wie Toolbar oder Scrollbar.
     * @returns {{width: *, height: *}}
     */
    var getOuterBrowserSize = function(){
        return {
            width: background.outerBrowserWidth,
            height: background.outerBrowserHeight
        }
    };

    /**
     * Liefert die innere Browsergröße, ohne Elemente wie Toolbar oder Scrollbar.
     * @returns {{width: *, height: *}}
     */
    var getInnerBrowserSize = function(){
        return {
            width: background.innerBrowserWidth,
            height: background.innerBrowserHeight
        }
    };

    /**
     * Liefert die Größe des Browsers. In Abhängigkeit zum Parameter werden entweder die inneren oder äußteren
     * Maße zurückgeliefert.
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
     * Liefert die Höhe des Browsers. In Abhängigkeit zum Parameter werden entweder die inneren oder äußteren
     * Maße zurückgeliefert.
     * @param {boolean} includingBrowserOffset - Angabe, ob die Größe inklusive Browserabmessung gesucht wird
     * @returns {int}
     */
    var getBrowserHeight = function(includingBrowserOffset){
        return includingBrowserOffset ? background.outerBrowserHeight : background.innerBrowserHeight;
    };

    /**
     * Liefert die erreichbare Browser-Größe. In Abhängigkeit zum Parameter werden entweder die maximalen
     * inneren oder äußteren Maße zurückgeliefert.
     * @param {boolean} includingBrowserOffset - Angabe, ob die Größe inklusive Browserabmessung gesucht wird
     * @returns {{width: int, height: int}}
     */
    var getAvailBrowserSize = function(includingBrowserOffset){
        var browserOffset = getBrowserOffset();
        return {
            width: includingBrowserOffset ? background.availBrowserWidth : background.availBrowserWidth - browserOffset.x,
            height: includingBrowserOffset ? background.availBrowserHeight : background.availBrowserHeight - browserOffset.y
        }
    };

    /**
     * Liefert die Liste der greifenden Media Angaben.
     * @returns {string[]} - String-Liste der greifenden Media Queries
     */
    var getMediaList = function(){
        return background.mediaList;
    };

    /**
     * Liefert den Offset, den der Browser aktuell durch Elemente Scroll- oder Toolbars einnimmt.
     * @returns {{x: int, y: int}}
     */
    var getBrowserOffset = function(){
        return background.browserOffset;
    };

    return {
        getMediaList: getMediaList,
        getBrowserHeight: getBrowserHeight,
        getBrowserWidth: getBrowserWidth,
        getBrowserSize: getBrowserSize,
        getAvailBrowserSize: getAvailBrowserSize,
        getBrowserOffset: getBrowserOffset
    };
});