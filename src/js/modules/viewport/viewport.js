/**
 * Beinhaltet die Funktionalitäten des Viewport Moduls,
 * zur Betrachtung der Website in den verschiedenen Pixelbreiten.
 */
define(
    ['jquery', 'config']
,
    function($, config) {
        // Selektoren für die benötigten Elemente
        var widthScrollBar = "#widthScrollBar",
            heightScrollBar = "#heightScrollBar",
            resolutionDropdown = '#resolutions',
            animationDurationScrollBar = '#animationDurationScrollBar',
            animationStart = '#animationStart',
            animationEnd = '#animationEnd',
            animationTimes = '#animationTimes',
            animationButton = '#animationButton';

        /**
         * Initialisiert eine Scrollbar zur Manipulation der Größe eines Browsers.
         * Dazu wird der minimale, maximale und aktuelle Wert der Scrollbar initialisiert,
         * die Anzeige des aktuellen Wertes , sowie die Callbacks zum Ändern der Breite, bzw. Höhe gesetzt.
         * @param $scrollbar Element ScrollBar
         * @param max int Maximalwert
         * @param min int Minimalwert
         * @param changeWidth boolean Angabe, ob der Browser in seiner Breite manipuliert werden soll
         * @param changeHeight boolean Angabe, ob der Browser in seiner Höhe manipuliert werden soll
         */
        var initScrollBar = function($scrollbar, max, min, changeWidth, changeHeight) {
            $scrollbar.attr('max', max);
            $scrollbar.attr('min', min);
            $scrollbar.val(min);
            $scrollbar.next().html(min + "px");

            showScrollBarValue($scrollbar, $scrollbar.next(), "px");
            $scrollbar.change(function() {
                var value = parseInt($(this).val());
                if(changeWidth) {
                    changeWindowSize(value, null);
                }
                if(changeHeight) {
                    changeWindowSize(null, value);
                }
            });
        };

        /**
         * Initialisiert die Anzeige des Wertes, der aktuell auf der ScrollBar angezeigt wird.
         * @param $scrollbar ScrollBar
         * @param $displayElement Element, dass den aktuellen Wert anzeigen soll
         * @param unit String Einheit der Anzeige (z.B. "px")
         */
        var showScrollBarValue = function($scrollbar, $displayElement, unit) {
            $scrollbar.mousemove(function() {
                // Anzeige aktualisieren
                $displayElement.html(parseInt($(this).val()) + unit);
            });
        };

        /**
         * Initialisiert den Schieberegeler zur Beeinflussung der Breite des Browserfenster.
         * Dazu wird der minimal und maximal möglichen Wert, auf den die Breite des Browserfensters verändert
         * werden kann, gesetzt.Der Initiale Wert wird auf die Mitte des Reglers gesetzt.
         * Auch die benötigten Callbacks werden gesetzt,
         */
        var initWidthScrollBar = function() {
            var $scrollbar = $(widthScrollBar),         // Schieberegler
                maxWidth = window.screen.availWidth,    // Maximalbreite des Browsers
                minWidth = 299;         // Mindest-Breite des Browsers
            initScrollBar($scrollbar, maxWidth, minWidth, true, false);
        };

        /**
         * Initialisiert den Schieberegeler zur Beeinflussung der Höhe des Browserfenster.
         * Dazu wird der minimal und maximal möglichen Wert, auf den die Höhe des Browserfensters verändert
         * werden kann, gesetzt.Der Initiale Wert wird auf die Mitte des Reglers gesetzt.
         * Auch die benötigten Callbacks werden gesetzt,
         */
        var initHeightScrollBar = function() {
            var $scrollbar = $(heightScrollBar),         // Schieberegler
                maxHeight = window.screen.availHeight;   // Bildschirmbreite
            initScrollBar($scrollbar, maxHeight, 1, false, true);
        };

        /**
         * Skaliert das Browserfenster auf die gegebene Breite.
         * @param width int Zeil-Browser-Breite
         */
        var changeWindowSize = function(width, height) {
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
         * Initialisiert das Dropdown mit den vorgefertigten Auflösugnen.
         */
        var initResolutionDropDown = function() {
            var $resolutions = $(resolutionDropdown);
            // injizieren der Auflösungen
            $.each(config.resolutions, function(index, item){
                $resolutions.append("<option value='" + index +"'>" + item.name + "</option>");
            });
            // Breite Anpassen, wenn eine bestimmte Auflösungausgewählt wird
            $resolutions.change(function(){
               var selectedResolution = config.resolutions[$resolutions.find(":selected").val()];
                changeWindowSize(selectedResolution.width, selectedResolution.height);
            });
        };

        var checkAnimationEnd = function(time, start, end, curWidth, interval, wantedCalls, doneCalls) {
            if(((start >= end) && (curWidth <= end))
            || ((start < end) && (curWidth > end))){
                    window.clearInterval(interval);
                    checkForRestart(time, start, end, wantedCalls, doneCalls)
            }
        };

        var checkForRestart = function(time, start, end, wantedCalls, doneCalls) {
            if(doneCalls < wantedCalls) {
                animateWidth(time, end, start, wantedCalls, doneCalls);
            }
        };

        /**
         * Animiert die Breite des Browsers.
         * @param time int Zeit in Sekunden, die die Animation dauern soll
         * @param start int Start-Breite
         * @param end int End-Breite
         */
        var animateWidth = function(time, start, end, wantedCalls, doneCalls) {
            var timePerCall = time / wantedCalls,
                dist = start - end,
                stepPerMs = (dist / timePerCall) / 1000,
                curWidth = start,
                lastCall = $.now(),
                currentCall = $.now();
            doneCalls++;
            changeWindowSize(start, null);
            var interval = window.setInterval(function(){
                currentCall = $.now();
                var timeDist = currentCall - lastCall,
                    animationDist = stepPerMs * timeDist;
                curWidth = start - animationDist;
                changeWindowSize(parseInt(Math.round(curWidth)));
                checkAnimationEnd(time, start, end, curWidth, interval, wantedCalls, doneCalls);
            }, 1);
        };

        var initAnimation = function() {
            var $animationButton = $(animationButton),
                $scrollbar = $(animationDurationScrollBar),
                $animationStart = $(animationStart),
                $animationEnd = $(animationEnd),
                $animationTimes = $(animationTimes);
            showScrollBarValue($scrollbar, $scrollbar.next(), "s");
            $animationButton.click(function(){
                var startPx = $animationStart.val(),
                    endPx = $animationEnd.val(),
                    times = $animationTimes.val();
                if(startPx === "" || endPx === "" || times === "") {
                    alert("Für eine Animation müssen Start- und Endwert, wie auch die Anzahl an Wiederholungen gesetzt sein.");
                } else {
                    animateWidth($scrollbar.val(), startPx, endPx, times, 0);
                }
            });
        };

        // TODO rausnehmen
        //var initRequest = function() {
        //  $("#sendRequestButton").click(function(){
        //      chrome.tabs.executeScript(null, {
        //          file: "/js/modules/viewport/viewport-content-script.js"
        //      });
        //  });
        //
        //    chrome.tabs.executeScript(null,
        //        {code:"window.outerWidth"},
        //        function(results){
        //          console.log(results);
        //    });
        //};

        /**
         * Initialisiert das Viewport Modul.
         * Dafür werden die Maximalen Abmessungen auf Grundlage der Bildschirmauflösung gesetzt
         * und die entsprechenden Callbacks zur Manipulation des Browserfensters gesetzt.
         */
        var init = function (){
            $(document).ready(function(){
                initWidthScrollBar();
                initHeightScrollBar();
                initResolutionDropDown();
                initAnimation();
            });
        };

        return {
            init: init
        }
});
