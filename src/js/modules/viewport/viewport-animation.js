define([
    'viewportSize'
],
/**
 * Stellt Funktionen zur Animation der Browserbreite bereit.
 * @exports viewportAnimation
 * @param {module} viewportSize - viewportSize-Modul
 * @see module:viewportSize
 * @returns {{animateWidth: Function}}
 */
function(viewportSize) {
    /**
     * Animiert die Breite des Browsers.
     * @param {int} animationDuration - zur Verfügung stehende Zeit
     * @param {int} startWidth - Startbreite
     * @param {int} endWidth - Endbreite
     * @param {int} wantedAnimationCalls - gewollte Anzahl an Wiederholungen der Animation
     * @param {int} doneAnimationCalls - bereits getätigte Anzahl an Wiederholungen der Animation
     * @param {boolean} containsBrowserOffset - Angabe, ob die Breitenangaben die Maße des Browserfensters beinhalten
     */
    var animateWidth = function(animationDuration, startWidth, endWidth,
                           wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
        // Kapseln der Eckdaten in eigene Funktion, statt diese global im Modul zu speichern,
        // damit kein zeitgleicher Zugriff auf diese Variablen durch zwei Prozesse möglich ist
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
            deferredPromise,            // Deffered Object zur Verarbeitung des Stadiums der Animation
            currWidthDiff = 0;               // Genauigkeitsverlust durch runden

        /**
         * Beendet die Animation, wenn die Zielbreite des Browsers erreicht wurde und startet die Animation erneut,
         * wenn die Anzahl an gewollten Wiederholungen noch nicht erreicht wurde. Ist die Animation noch nicht
         * abgeschlossen, wir der nächste Render-Schritt angestoßen.
         */
        var checkAnimationEnd = function () {
            if (((start >= end) && (curWidth <= end))
                || ((start < end) && (curWidth >= end))) {
                checkForRestart();
            } else {
                requestAnimationFrame(animationStep);
            }
        };

        /**
         * Startet die Animation erneut mit vertauschtem Start- und Endwert,
         * wenn die gewollte Anzahl an Wiederholungen noch nicht erreicht wurde.
         * Ist die Animation abgeschlossen, wird der Status über das Deferred Object bekannt gegeben.
         */
        var checkForRestart = function () {
            if (doneCalls < wantedCalls) {
                animate(duration, end, start, wantedCalls, doneCalls, sizesContainBrowserOffset);
            } else {
                deferredPromise.resolve();
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
            durationPerCall = (duration / wantedCalls) * 1000;
            var dist = start - end;
            stepPerMs = (dist / durationPerCall);
            curWidth = start;
        };

        /**
         * Berechnet die gerundete Zielbreite für den aktuellen Animationsschritt und merkt sich die Differenz für
         * den nächsten Schritt zwischen. Dieser wird beim nächsten Schritt draufgerechnet, damit die Animation
         * innerhalb der gewünschten Zeit fertig wird.
         * @param browserWidth
         * @returns {*}
         */
        var roundBrowserWidth = function(browserWidth){
            var dest;
            browserWidth = browserWidth  + currWidthDiff;
            if (start >= end) {
                dest = Math.round(Math.max(end, browserWidth));
            } else {
                dest = Math.round(Math.min(end, browserWidth));
            }
            currWidthDiff = browserWidth - dest;
            return dest;
        };

        /**
         * Berechnet die Browserbreite auf die der Browser im aktuellen Animationsschritt skaliert werden muss.
         * @param {DOMHighResTimeStamp} currentTime - aktueller Zeitpunkt
         * @returns {number}
         */
        var calcBrowserWidth = function (currentTime) {
            var elapsedTime,
                animationDist;
            lastCall = !lastCall ? currentTime : lastCall;
            elapsedTime = currentTime - lastCall;
            lastCall = currentTime;
            animationDist = stepPerMs * elapsedTime;

            return roundBrowserWidth(curWidth - animationDist);
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
            requestAnimationFrame(animationStep);
        };

        /**
         * Führt einen Animationsschritt aus.
         * @param {DOMHighResTimeStamp} currentTime - aktueller Zeitpunkt
         */
        var animationStep = function(currentTime){
            curWidth = calcBrowserWidth(currentTime);
            viewportSize.changeWidth(curWidth, containsBrowserOffset);
            checkAnimationEnd();
        };

        deferredPromise = Promise.defer();
        // Animation anstoßen
        animate(
            animationDuration,
            startWidth,
            endWidth,
            wantedAnimationCalls,
            doneAnimationCalls,
            containsBrowserOffset
        );
        return deferredPromise.promise;
    };

    return {
        animateWidth: animateWidth
    };
});
