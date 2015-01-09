/**
 * Stellt Funktionen zur Berechnung der Breite und Höhe bereit, die der Browser, beispielsweise durch
 * Toolbar oder Scrollbar einnimmt.
 *
 * Der Aufruf, um dies zu ermitteln ist asynchron, und sollte deswegen so früh wie möglich initiiert werden,
 * um dafür zu Sorgen, dass die benötigten Werte vorliegen, wenn sie benötigt werden.
 */
define(
    ['jquery']
    ,
    function($) {
        var offsetWidth,     // Breite, die der Browser einnimmt
            offsetHeight;    // Höhe, die der Browser einnimmt

        /**
         * Liefert die Breite,den der Browser einnimmt (z.B. durch Toolbars, oder Scrollbars).
         */
        var getWidthBrowserOffsetAsynchronusly = function() {
            chrome.tabs.executeScript(null,
                {code:"window.outerWidth - window.innerWidth"},
                function(results){
                    // asynchroner Aufruf, deswegen einmal bei öffnen des Plugins auslesen und zwischenspeichern
                    offsetWidth = results[0];
                }
            );
        };

        /**
         * Liefert die Höhe, die der Browser einnimmt (z.B. durch Toolbars oder Scrollbars).
         */
        var getHeightBrowserOffsetAsynchronously = function() {
            chrome.tabs.executeScript(null,
                {code:"window.outerHeight - window.innerHeight"},
                function(results){
                    // asynchroner Aufruf, deswegen einmal bei öffnen des Plugins auslesen und zwischenspeichern
                    offsetHeight = results[0];
                }
            );
        };

        var getWidth = function() {
          return offsetWidth;
        };

        var getHeight = function() {
            return offsetHeight;
        };

        /**
         * Berechnet den Offset des Browser-Fensters.
         */
        var init = function() {
            getWidthBrowserOffsetAsynchronusly();
            getHeightBrowserOffsetAsynchronously();
        };

        return {
            getWidth: getWidth,
            getHeight: getHeight,
            init: init
        };
    }
);
