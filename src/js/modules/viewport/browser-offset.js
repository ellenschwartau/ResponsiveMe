/**
 * Stellt Funktionen zur Berechnung der Breite und Höhe bereit, die der Browser, beispielsweise durch
 * Toolbar oder Scrollbar einnimmt.
 *
 * Der Aufruf, um dies zu ermitteln ist asynchron, und sollte deswegen so früh wie möglich initiiert werden,
 * um dafür zu Sorgen, dass die benötigten Werte vorliegen, wenn sie benötigt werden.
 *
 * @module browserOffset
 */
define([
        'extension'
],
function(extension) {
    var offsetWidth,     // Breite, die der Browser einnimmt
        offsetHeight;    // Höhe, die der Browser einnimmt

    /**
     * Liefert die Breite,den der Browser einnimmt (z.B. durch Toolbars, oder Scrollbars).
     */
    var getWidthBrowserOffsetAsync = function() {
        extension.executeScriptCode(
            "window.outerWidth - window.innerWidth",
            function(results){
                // asynchroner Aufruf, deswegen einmal bei öffnen des Plugins auslesen und zwischenspeichern
                offsetWidth = results[0];
            }
        );
        // promises https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
    };

    /**
     * Liefert die Höhe, die der Browser einnimmt (z.B. durch Toolbars oder Scrollbars).
     */
    var getHeightBrowserOffsetAsync = function() {
        extension.executeScriptCode(
            "window.outerHeight - window.innerHeight",
            function(results){
                // asynchroner Aufruf, deswegen einmal bei öffnen des Plugins auslesen und zwischenspeichern
                offsetHeight = results[0];
            }
        );
    };

    /**
     * Liefert den Offset in Pixeln, der der Browser (z.B. durch Toolbar oder Scrollbar) einnimmt.
     * @returns {{x: int, y: int}}
     */
    var getBrowserOffset = function() {
        return {
            x: offsetWidth,
            y: offsetHeight
        };
    };

    /**
     * Berechnet den Offset des Browser-Fensters.
     */
    var init = function() {
        getWidthBrowserOffsetAsync();
        getHeightBrowserOffsetAsync();
    };

    return {
        get: getBrowserOffset,
        init: init
    };
});
