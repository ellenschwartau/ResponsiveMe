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
            resolutionDropdown = '#resolutions';

        /**
         * Initialisiert eine Scrollbar zur Manipulation der Größe eines Browsers.
         * @param $scrollbar Element ScrollBar
         * @param max int Maximalwert
         * @param min int Minimalwert
         * @param changeWidth boolean Angabe, ob der Browser in seiner Breite manipuliert werden soll
         * @param changeHeight boolean Angabe, ob der Browser in seiner Höhe manipuliert werden soll
         */
        var initScrollBar = function($scrollbar, max, min, changeWidth, changeHeight) {
            var middle = parseInt((max - min) / 2);
            // Attribute der ScrollBar setzen
            $scrollbar.attr('max', max);
            $scrollbar.attr('min', min);
            $scrollbar.val(middle);
            $scrollbar.next().html(middle + "px");

            // Callbacks setzen
            $scrollbar.mousemove(function() {
                // Anzeige aktualisieren
                $(this).next().html(parseInt($(this).val()) + "px");
            });
            $scrollbar.change(function() {
                // Browser skalieren
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
         * Initialisiert den Schieberegeler zur Beeinflussung der Breite des Browserfenster.
         * Dazu wird der minimal und maximal möglichen Wert, auf den die Breite des Browserfensters verändert
         * werden kann, gesetzt.Der Initiale Wert wird auf die Mitte des Reglers gesetzt.
         * Auch die benötigten Callbacks werden gesetzt,
         */
        var initWidthScrollBar = function() {
            var $scrollbar = $(widthScrollBar),              // Schieberegler
                maxWidth = window.screen.availWidth,    // Bildschirmbreite
                minWidth = $(document).width();         // Popup Breite
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
            initScrollBar($scrollbar, maxHeight, 0, false, true);
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
            });
        };

        return {
            init: init
        }
});
