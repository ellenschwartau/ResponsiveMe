/**
 * Skript zur Anzeige von Elementen durch eine Umrandung in einer angegebenen Farbe und Breite.
 * Die Elemente werden durch ihre css-Selektoren identifiziert.
 * @module visualizeElements
 */
define([
    'jquery', 'extension', 'config'
],
function($, extension, config){
    /**
     * Stößt die Anzeige der Elemente, die über die Selektoren identifiziert werden an.
     * @param {string[]} selectors -  Selektoren der Elemente, die angezeigt werden sollen
     * @param {string} color - Anzeigefarbe
     * @param {int} width - Dicke der Umrandung
     */
    var triggerShowElements = function(selectors, color, width) {
        extension.sendMessageToTab({
            type: config.messageTypes.showElements,
            data: {
                selectors: selectors,
                color: color,
                width: width
            }
        });
    };

    /**
     * Liefert den CSS String zur Darstellung einer Außenlinie in der angegebenen Farbe und Dicke.
     * @param {string} color - Anzeigefarbe
     * @param {int} width - Dicke der Umrandung
     * @returns {{css}}
     */
    var getCssToDisplayElement = function(color, width) {
        // border-box: sorgt dafür, dass die Border nicht auf die Breite aufaddiert wird,
        // sodass die Umrangun nicht zu ungewollten Umbrüchen u.Ä. führt
        return {
            "border": "solid " + color + " " + width + "px",
            "box-sizing": "border-box"
        };
    };

    /**
     * Kennzeichnet die Elemente, die durch die Selektoren definiert werden,
     * durch eine Außenlinie in der übergebenen Farbe und Pixelbreite.
     * @param {string[]} selectors - css-Selektoren
     * @param {string} color - Anzeigefarbe
     * @param {int} width - Dicke der Umrandung
     */
    var showElements = function(selectors, color, width) {
        $.each(selectors, function(i, selector) {
            $(selector).css(
                getCssToDisplayElement(color, width)
            );
        });
    };

    return {
        triggerShowElements: triggerShowElements,
        show: showElements
    };

});
