/**
 * Stellt Funktionen zur Animation der Browser-Breite bereit.
 */
define(
    ['jquery']
    ,
    function($) {
        var start,                  // Start-Breite
            end,                    // End-Breite
            duration,               // Zur Verfügung stehende Zeit
            wantedCalls,            // gewünschte Wiederholungen
            doneCalls,              // durchgeführte Wiederholungen
            durationPerCall,        // zur Verfügung stehende Zeit pro Wiederholung
            stepPerMs,              // anzupassende breite pro ms
            curWidth,               // aktelle Breite
            widthBrowserOffset,     // Breite, die der Browser einnimmt
            heightBrowserOffset,    // Höhe, die der Browser einnimmt
            sizesContainBrowserOffset;  // Angabe, ob die Größenangaben inklusive der Browserabmessung gemeint sind

        /**
         * Liefert die Breite,den der Browser einnimmt (z.B. durch Toolbars, oder Scrollbars).
         */
        var getWidthBrowserOffsetAsynchronusly = function() {
            chrome.tabs.executeScript(null,
                {code:"window.outerWidth - window.innerWidth"},
                function(results){
                    // asynchroner Aufruf, deswegen einmal bei öffnen des Plugins auslesen und zwischenspeichern
                    widthBrowserOffset = results[0];
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
                    heightBrowserOffset = results[0];
                }
            );
        };

        /**
         * Berechnet die Zielbreite, auf die der Browser skaliert werden muss.
         * @param width                     int         Zielbreite
         *                                  null        Breite soll sich nicht verändern
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         * @returns int
         */
        var calcDestWidth = function(width, containsBrowserOffset) {
            if(width != null) {
                // Browser-Breite aufaddieren, damit der Content selbst die Zielbreite hat
                return containsBrowserOffset ? width : width + widthBrowserOffset;
            }
            return width;
        };

        /**
         * Berechnet die Zielhöhe, auf die der Browser skaliert werden muss.
         * @param height                    int         Zielhöhe
         *                                  null        Höhe soll sich nicht verändern
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         * @returns int
         */
        var calcDestHeight = function(height, containsBrowserOffset) {
            if(height != null) {
                // Browser-Höhe aufaddieren, damit der Content selbst die Zielhöhe hat
                return containsBrowserOffset ? height : height + heightBrowserOffset;
            }
            return height;
        };

        /**
         * Passt die aktuelle Anzeige je nach Einstellung des Inner/Outer-Switch an,
         * die Breite und Höhe der Browserelemente werden also zur Größe dazuaddiert oder abgezogen.
         * @param containsBrowserOffset  boolean  Angabe, ob die Größenangaben die Größte der
         *                                        Browserelemente (z.B. Toolbar) mit einbezieht
         */
        var toggleInnerOuter = function(containsBrowserOffset) {
            chrome.windows.getCurrent(function(win){
                // Im Falle dass containsBrowserOffset true:
                // Es wurde von Inner auf Outer getogglet, BrowserOffset muss dann wieder abgezogen werden
                // Wenn containsBrowserOffset true, werden der Offset innerhalb der changeSize aufaddiert
                var width = win.width,
                    height = win.height;
                if(containsBrowserOffset) {
                    width -= widthBrowserOffset;
                    height -= heightBrowserOffset;
                } else {
                    width += widthBrowserOffset;
                    height += heightBrowserOffset;
                }
                changeSize(width, height);
            });
        };

        /**
         * Skaliert das Browser-Fenster mit Hilfe der chrome.windows-API.
         * @param width     int     Breite, auf die der Browser skaliert werden soll
         *                          null, wenn die aktuelle Breite beibehalten werden soll
         * @param height    int     Höhe, auf die der Browser skaliert werden soll
         *                          null, wenn die aktuelle Höhe beibehalten werden soll
         */
        var changeSize = function(width, height) {
            chrome.windows.getCurrent(function (win) {
                // Position und Maße definieren
                var destWidth = (width != null) ? width : win.width,
                    destHeight = (height != null) ? height : win.height,
                    updateInfo = {
                        width: destWidth,
                        height: destHeight,
                        state: "normal" // auf normal setzen, da im Vollbildmodus nicht skaliert werden kann
                    };
                // Fenster aktualisieren
                chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, updateInfo);
            });
        };

        /**
         * Skaliert das Browserfenster auf die gegebene Breite.
         * @param width                     int         Ziel-Browser-Breite
         * @param height                    int         Ziel-Browser-Breite
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         */
        var calcAndChangeSize = function(width, height, containsBrowserOffset) {
            changeSize(calcDestWidth(width, containsBrowserOffset), calcDestHeight(height, containsBrowserOffset));
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
         */
        var calcAnimationData = function(animationDuration, startWidth, endWidth,
                                         wantedAnimationCalls, doneAnimationCalls, containsBrowserOffset) {
            // Zwischenspeichern
            start = startWidth;
            end = endWidth;
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
         * @param animationDuration     int zur Verfügung stehende Zeit
         * @param startWidth            int Startbreite
         * @param endWidth              int Endbreite
         * @param wantedAnimationCalls  int gewollte Anzahl an Wiederholungen der Animation
         * @param doneAnimationCalls    int getätigte Anzahl an Wiederholungen der Animation
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
            changeSize(start, null, containsBrowserOffset);
            // Animation durchführen
            interval = window.setInterval(function(){
                currentCall = $.now();
                timeDist = currentCall - lastCall,
                animationDist = stepPerMs * timeDist;
                curWidth = parseInt(Math.round(start - animationDist));
                changeSize(curWidth, null, containsBrowserOffset);
                checkAnimationEnd(interval);
            }, 1);
        };

        /**
         * Initialisiert die Angaben, wie viel Pixel der Browser horizontal wie auch vertikal einnimmt
         * (dazu zählen beispielsweise Tool- oder Scrollbars).
         * Weil die Abfrage Asynchron erfolgt, sollte diese Initialisierung so früh wie möglich stattfinden.
         */
        var init = function() {
            getWidthBrowserOffsetAsynchronusly();
            getHeightBrowserOffsetAsynchronously();
        };

        return {
            animateWidth: animateWidth,
            changeSize: calcAndChangeSize,
            toggleInnerOuter: toggleInnerOuter,
            init: init
        }
    }
);