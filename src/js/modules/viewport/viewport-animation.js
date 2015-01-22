/**
 * Animiert die Breite eines Browserfensters.
 */
define([
    'jquery', 'viewportSize'
],
function($, viewportSize) {
    /**
     * Animiert die Breite des Browsers.
     * @param {int} animationDuration - zur Verfügung stehende Zeit
     * @param {int} startWidth - Startbreite
     * @param {int} endWidth - Endbreite
     * @param {int} wantedAnimationCalls - gewollte Anzahl an Wiederholungen der Animation
     * @param {int} doneAnimationCalls - getätigte Anzahl an Wiederholungen der Animation
     * @param {boolean} containsBrowserOffset - Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
     */
    var animateWidth = function(animationDuration, startWidth, endWidth,
                           wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
        // Kaspeln in eigene Funktion, damit kein zeitgleicher Zugriff auf diese Variablen durch zwei Prozesse möglich ist
        var start,                      // Start-Breite
            end,                        // End-Breite
            duration,                   // Zur Verfügung stehende Zeit
            wantedCalls,                // gewünschte Wiederholungen
            doneCalls,                  // durchgeführte Wiederholungen
            durationPerCall,            // zur Verfügung stehende Zeit pro Wiederholung
            stepPerMs,                  // anzupassende breite pro ms
            curWidth,                   // aktelle Breite
            sizesContainBrowserOffset,  // Angabe, ob die Größenangaben inklusive der Browserabmessung gemeint sind
            lastCall,                   // Zeitpunkt des letzen Animationsschritts
            CALL_ANIMATION_EVERY_X_MS = 10;              // Anagebe, wie oft die Animationsfunktion aufgerufen werden soll

        /**
         * Beendet die Animation, wenn die Zielbreite des Browsers erreicht wurde und startet die Animation erneut,
         * wenn die Anzahl an gewollten Wiederholungen noch nicht erreicht wurde.
         * @param {int} interval - ID des Intervalls, das die Animation durchführt
         */
        var checkAnimationEnd = function (interval) {
            if (((start >= end) && (curWidth <= end))
                || ((start < end) && (curWidth >= end))) {
                window.clearInterval(interval);
                checkForRestart();
            }
        };

        /**
         * Startet die Animation erneut mit vertauschtem Start- und Endwert,
         * wenn die gewollte Anzahl an Wiederholungen noch nicht erreicht wurde.
         */
        var checkForRestart = function () {
            if (doneCalls < wantedCalls) {
                animate(duration, end, start, wantedCalls, doneCalls, sizesContainBrowserOffset);
            }
        };

        /**
         * Speichert die Eckdaten der Animation zwischen.
         * @param {int} animationDuration - zur Verfügung stehende Zeit
         * @param {int} startWidth - Startbreite
         * @param {int} endWidth - Endbreite
         * @param {int} wantedAnimationCalls - gewollte Anzahl an Wiederholungen der Animation
         * @param {int} doneAnimationCalls - getätigte Anzahl an Wiederholungen der Animation
         * @param {boolean} containsBrowserOffset - Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
         */
        var calcAnimationData = function (animationDuration, startWidth, endWidth,
                                          wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
            // Zwischenspeichern
            start = startWidth;
            end = endWidth;
            wantedCalls = wantedAnimationCalls;
            doneCalls = doneAnimationCalls;
            duration = animationDuration;
            sizesContainBrowserOffset = containsBrowserOffset;

            // zusätzliche Berechnungen
            durationPerCall = duration / wantedCalls;
            var dist = start - end;
            stepPerMs = (dist / durationPerCall) / 1000;
            curWidth = start;
            lastCall = $.now();
        };

        /**
         * Berechnet die Browserbreite, auf die der Browser im aktuellen Animationsschritt animiert werden sollte.
         * @returns {number}
         */
        var calcBrowserWidth = function () {
            var currentCall = $.now(),
                elapsedTime,
                animationDist;

            elapsedTime = currentCall - lastCall;
            lastCall = currentCall;
            animationDist = stepPerMs * elapsedTime;

            if (start >= end) {
                return Math.round(Math.max(end, curWidth - animationDist));
            } else {
                return Math.round(Math.min(end, curWidth - animationDist));
            }
        };

        /**
         * Animiert die Breite des Browsers.
         * @param {int} animationDuration - zur Verfügung stehende Zeit
         * @param {int} startWidth - Startbreite
         * @param {int} endWidth - Endbreite
         * @param {int} wantedAnimationCalls - gewollte Anzahl an Wiederholungen der Animation
         * @param {int} doneAnimationCalls - getätigte Anzahl an Wiederholungen der Animation
         * @param {boolean} containsBrowserOffset - Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
         */
        var animate = function (animationDuration, startWidth, endWidth,
                                     wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
            calcAnimationData(
                animationDuration, startWidth, endWidth, wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset
            );
            doneCalls++;
            viewportSize.changeWidth(start, containsBrowserOffset);
            // Animation durchführen
            var interval = window.setInterval(function () {
                curWidth = calcBrowserWidth();
                viewportSize.changeWidth(curWidth, containsBrowserOffset);
                checkAnimationEnd(interval);
            }, CALL_ANIMATION_EVERY_X_MS);
            // TODO Request Animation Frame
        };

        // Animation anstoßen
        animate(
            animationDuration,
            startWidth,
            endWidth,
            wantedAnimationCalls,
            doneAnimationCalls,
            containsBrowserOffset
        );
    };

    /**
     * Initialisiert den Browser-Offset.
     */
    var init = function() {
        viewportSize.init();
    };

    return {
        animateWidth: animateWidth,
        init: init
    };
});
