/**
 * Stellt Funktionen zur Animation der Browser-Breite bereit.
 */
define(
    ['jquery']
    ,
    function($) {
        var start,              // Start-Breite
            end,                // End-Breite
            duration,           // Zur Verfügung stehende Zeit
            wantedCalls,        // gewünschte Wiederholungen
            doneCalls,          // durchgeführte Wiederholungen
            durationPerCall,    // zur Verfügung stehende Zeit pro Wiederholung
            stepPerMs,          // anzupassende breite pro ms
            curWidth,           // aktelle Breite
            lastCall,           // Zeitpunkt des letzen Animationsschritts
            currentCall;        // Zeitpunkt des aktuellen Animationsschritts

        /**
         * Skaliert das Browserfenster auf die gegebene Breite.
         * @param width int Zeil-Browser-Breite
         */
        var changeSize = function(width, height) {
            chrome.windows.get(chrome.windows.WINDOW_ID_CURRENT, function(win){
                // Position und Maße definieren
                var destWidth = (width != null) ? width : win.width,
                    destHeight = (height != null) ? height : win.height,
                    updateInfo = {
                        width: destWidth,
                        height: destHeight,
                        top: win.top,
                        left: win.left,
                        state: "normal" // auf normal setzen, da im Vollbildmodus nicht skaliert werden kann
                    };
                // Fenster aktualisieren
                chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, updateInfo);
            });
        };

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
                animateWidth(duration, end, start, wantedCalls, doneCalls);
            }
        };

        /**
         * Speichert die Eckdaten der Animation zwischen.
         * @param animationDuration     int zur Verfügung stehende Zeit
         * @param startWidth            int Startbreite
         * @param endWidth              int Endbreite
         * @param wantedAnimationCalls  int gewollte Anzahl an Wiederholungen der Animation
         * @param doneAnimationCalls    int getätigte Anzahl an Wiederholungen der Animation
         */
        var calcAnimationData = function(animationDuration, startWidth, endWidht, wantedAnimationCalls, doneAnimationCalls) {
            // Zwischenspeichern
            start = startWidth;
            end = endWidht;
            start = startWidth;
            end = endWidht;
            wantedCalls = wantedAnimationCalls;
            doneCalls = doneAnimationCalls;
            duration = animationDuration;

            // zusätzliche Berechnungen
            durationPerCall = duration / wantedCalls;
            var dist = start - end;
            stepPerMs = (dist / durationPerCall) / 1000;
            curWidth = start;

        };

        /**
         * Animiert die Breite des Browsers.
         * @param animationDuration     int zur Verfügung stehende Zeit
         * @param startWidth            int Startbreite
         * @param endWidth              int Endbreite
         * @param wantedAnimationCalls  int gewollte Anzahl an Wiederholungen der Animation
         * @param doneAnimationCalls    int getätigte Anzahl an Wiederholungen der Animation
         */
        var animateWidth = function(animationDuration, startWidth, endWidht, wantedAnimationCalls, doneAnimationCalls) {
            calcAnimationData(animationDuration, startWidth, endWidht, wantedAnimationCalls, doneAnimationCalls);
            var lastCall = $.now(),     // Zeitpunkt des letzen Animationsschritts
                currentCall = $.now(),  // Zeitpunkt des aktuellen Animationsschritts
                timeDist,               // Verstrichene Zeit seit dem letzten Animationsschritts
                animationDist,          // Notwendige Anpassung der Breite in Relation zur verstrichenen Zeit
                interval;               // ID des Callback, der die Animation ausführt

            // Anzahl der durchgeführten Animationen erhöhen
            doneCalls++;
            // Ausgangsbreite setzen
            changeSize(start, null);
            // Animation durchführen
            interval = window.setInterval(function(){
                currentCall = $.now();
                timeDist = currentCall - lastCall,
                animationDist = stepPerMs * timeDist;
                curWidth = parseInt(Math.round(start - animationDist));
                changeSize(curWidth, null);
                checkAnimationEnd(interval);
            }, 1);
        };

        return {
            animateWidth: animateWidth,
            changeSize: changeSize
        }
    }
);