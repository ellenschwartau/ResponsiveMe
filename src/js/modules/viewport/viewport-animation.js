/**
 * Animiert die Breite eines Browserfensters.
 */
define([
    'jquery', 'viewportSize'
],
function($, viewportSize) {
    var start,                  // Start-Breite
        end,                    // End-Breite
        duration,               // Zur Verfügung stehende Zeit
        wantedCalls,            // gewünschte Wiederholungen
        doneCalls,              // durchgeführte Wiederholungen
        durationPerCall,        // zur Verfügung stehende Zeit pro Wiederholung
        stepPerMs,              // anzupassende breite pro ms
        curWidth,               // aktelle Breite
        sizesContainBrowserOffset;  // Angabe, ob die Größenangaben inklusive der Browserabmessung gemeint sind

    /**
     * Beendet die Animation, wenn die Zielbreite des Browsers erreicht wurde und startet die Animation erneut,
     * wenn die Anzahl an gewollten Wiederholungen noch nicht erreicht wurde.
     * @param interval ID des Intervalls, das die Animation durchführt
     */
    var checkAnimationEnd = function(interval) {
        if(((start >= end) && (curWidth <= end))
            || ((start < end) && (curWidth > end))){
            window.clearInterval(interval);
            checkForRestart();
        }
    };

    /**
     * Startet die Animation erneut mit vertauschtem Start- und Endwert,
     * wenn die gewollte Anzahl an Wiederholungen noch nicht erreicht wurde.
     */
    var checkForRestart = function() {
        if(doneCalls < wantedCalls) {
            animateWidth(duration, end, start, wantedCalls, doneCalls, sizesContainBrowserOffset);
        }
    };

    /**
     * Speichert die Eckdaten der Animation zwischen.
     * @param animationDuration     int zur Verfügung stehende Zeit
     * @param startWidth            int Startbreite
     * @param endWidth              int Endbreite
     * @param wantedAnimationCalls  int gewollte Anzahl an Wiederholungen der Animation
     * @param doneAnimationCalls    int getätigte Anzahl an Wiederholungen der Animation
     * @param containsBrowserOffset boolean Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
     */
    var calcAnimationData = function(animationDuration, startWidth, endWidth,
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
    };

    /**
     * Animiert die Breite des Browsers.
     * @param animationDuration     int     zur Verfügung stehende Zeit
     * @param startWidth            int     Startbreite
     * @param endWidth              int     Endbreite
     * @param wantedAnimationCalls  int     gewollte Anzahl an Wiederholungen der Animation
     * @param doneAnimationCalls    int     getätigte Anzahl an Wiederholungen der Animation
     * @param containsBrowserOffset boolean Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
     */
    var animateWidth = function(animationDuration, startWidth, endWidth,
                                wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
        calcAnimationData(
            animationDuration, startWidth, endWidth, wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset
        );
        var lastCall = $.now(),     // Zeitpunkt des letzen Animationsschritts
            currentCall = $.now(),  // Zeitpunkt des aktuellen Animationsschritts
            timeDist,               // Verstrichene Zeit seit dem letzten Animationsschritts
            animationDist,          // Notwendige Anpassung der Breite in Relation zur verstrichenen Zeit
            interval;               // ID des Callback, der die Animation ausführt

        // Anzahl der durchgeführten Animationen erhöhen
        doneCalls++;
        // Ausgangsbreite setzen
        viewportSize.changeWidth(start, containsBrowserOffset);
        // Animation durchführen
        curWidth = start;
        interval = window.setInterval(function(){
            currentCall = $.now();
            timeDist = currentCall - lastCall;
            animationDist = stepPerMs * timeDist;
            curWidth = Math.round(Math.max(end, curWidth - animationDist));
            viewportSize.changeWidth(curWidth, containsBrowserOffset);
            checkAnimationEnd(interval);
        }, 1);
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
