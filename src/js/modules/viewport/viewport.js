/**
 * Beinhaltet die Funktionalitäten des Viewport Moduls,
 * zur Betrachtung der Website in den verschiedenen Pixelbreiten.
 */
define([
    'jquery', 'config', 'viewportSize', 'viewportAnimation'
],
function($, config, viewportSize, viewportAnimation) {
    // Selektoren für die benötigten Elemente
    var widthScrollBar = "#widthScrollBar",
        heightScrollBar = "#heightScrollBar",
        resolutionDropdown = '#resolutions',
        animationDurationScrollBar = '#animationDurationScrollBar',
        animationStart = '#animationStart',
        animationEnd = '#animationEnd',
        animationTimes = '#animationTimes',
        animationButton = '#animationButton',
        innerOuterSwitch ='#switchInnerOuter',
        // Fehlermeldung
        MSG_ANIMATION_DATA_MISSING = "Für eine Animation müssen Start- und Endwert, wie auch die Anzahl an Wiederholungen gesetzt sein.",
        // Angabe ob die Browsermaße mit in die Breitenangabe einfließen
        sizesContainBrowserOffset;

    /**
     * Liest die Einstellung aus,ob die Größenangaben inklusive der Browserabmessungen
     * (z.B. Tool- oder Scrolbars) gemacht werden.
     * @returns boolean
     */
    var doSizesContainBrowserOffset = function() {
        return $(innerOuterSwitch).is(":checked");
    };

    /**
     * Liest die Anfangseinstellung des Inner/Outer-Switch aus und setzt den Wert erneut,
     * wenn die Einstellung geändert wird.
     */
    var initInnerOuterSwitch = function() {
        sizesContainBrowserOffset = doSizesContainBrowserOffset();
        $(innerOuterSwitch).change(function() {
            sizesContainBrowserOffset = !sizesContainBrowserOffset;
            viewportSize.toggleInnerOuter(sizesContainBrowserOffset);
        });
    };

    /**
     * Aktualisiert den Wert und die Anzeige einer Scrollbar
     * @param $scrollbar    Element Scrollbar
     * @param value         int     Wert
     * @param unit          String  Einheit
     */
    var updateScrollbarValue = function($scrollbar, value, unit) {
        $scrollbar.val(value);
        $scrollbar.next().html(value + unit);
    };

    /**
     * Initialisiert eine Scrollbar zur Manipulation der Größe eines Browsers.
     * Dazu wird der minimale, maximale und aktuelle Wert der Scrollbar initialisiert,
     * die Anzeige des aktuellen Wertes , sowie die Callbacks zum Ändern der Breite, bzw. Höhe gesetzt.
     * @param $scrollbar Element ScrollBar
     * @param max           int     Maximalwert
     * @param min           int     Minimalwert
     * @param changeWidth   boolean Angabe, ob der Browser in seiner Breite manipuliert werden soll
     * @param changeHeight  boolean Angabe, ob der Browser in seiner Höhe manipuliert werden soll
     */
    var initScrollBar = function($scrollbar, max, min, changeWidth, changeHeight) {
        // Werte initialiseren
        $scrollbar.attr('max', max);
        $scrollbar.attr('min', min);
        updateScrollbarValue($scrollbar, min, "px");

        // Callbacks setzen (Anzeige und Ändern der Bildschirmbreite triggern)
        showScrollBarValue($scrollbar, $scrollbar.next(), "px");
        $scrollbar.change(function() {
            var value = parseInt($(this).val());
            if(changeWidth) {
                viewportSize.changeWidth(value, sizesContainBrowserOffset);
            }
            if(changeHeight) {
                viewportSize.changeHeight(value, sizesContainBrowserOffset);
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
            // Anzeige aktualisieren, wenn die Maus darüber bewegt wird
            // (weniger komplex als auf Click + Mousemove, da es hierfür kein Event gibt)
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
            minWidth = 299;                         // Mindest-Breite des Browsers
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
     * Initialisiert das Dropdown mit den vorgefertigten Auflösugnen.
     */
    var initResolutionDropDown = function() {
        var $resolutions = $(resolutionDropdown);

        // Breite Anpassen, wenn eine bestimmte Auflösungausgewählt wird
        $resolutions.change(function(){
           var selectedResolution = config.resolutions[$resolutions.find(":selected").val()];
            viewportSize.changeSize(selectedResolution.width, selectedResolution.height, sizesContainBrowserOffset);
            updateScrollbarValue($(widthScrollBar), selectedResolution.width, "px");
            updateScrollbarValue($(heightScrollBar), selectedResolution.height, "px");
        });
    };

    /**
     * Initialisiert die Animation des Viewports.
     * Bei Betätigung des Animations-Buttons werden die benötigten Daten:
     * - Start-Breite
     * - End-Breite
     * - Animations-Zeitraum
     * - Anzahl an Wiederholungen
     * ausgelesen und die Animation gestartet.
     * Auch die Anzeige des Aktuell auf dem Schieberegler der Zeitangabe eingestellten Wertes wird initialisiert.
     */
    var initAnimation = function() {
        var $animationButton = $(animationButton),              // Button zum Starten der Animation
            $animationDuration = $(animationDurationScrollBar), // Regler zum Einstellen der Animationdauer
            $animationStart = $(animationStart),                // Input zur Angabe der Start-Breite
            $animationEnd = $(animationEnd),                    // Input zur Angabe der End-Breite
            $animationTimes = $(animationTimes);                // Input zur Angabe der gewollten Wiederholungen

        // Anzeige des Zeitwertes initialiseren
        showScrollBarValue($animationDuration, $animationDuration.next(), "s");
        // Callback zum Starten der Animation initialisieren
        $animationButton.click(function(){
            // Angaben auslesen
            var startPx = parseInt($animationStart.val()),
                endPx = parseInt($animationEnd.val()),
                times = parseInt($animationTimes.val());
            if(isNaN(startPx) || isNaN(endPx) || isNaN(times)) {
                // Bei fehlenden Angaben eine Fehlermeldung ausgeben
                alert(MSG_ANIMATION_DATA_MISSING);
            } else {
                // Animation starten
                viewportAnimation.animateWidth($animationDuration.val(), startPx, endPx, times, 0);
                updateScrollbarValue($(widthScrollBar), endPx, "px");
            }
        });
    };

    /**
     * Initialisiert das Markup des Moduls.
     * Dabei werden die vordefinierten Auflösungen geladen.
     * @param $data Markup des Popups
     */
    var initData = function($data) {
        // injizieren der Auflösungen
        $.each(config.resolutions, function(index, item){
            $data.find(resolutionDropdown).append("<option value='" + index +"'>" + item.name + "</option>");
        });
    };

    /**
     * Initialisiert das Viewport Modul.
     * Dafür werden die Maximalen Abmessungen auf Grundlage der Bildschirmauflösung gesetzt
     * und die entsprechenden Callbacks zur Manipulation des Browserfensters gesetzt.
     */
    var init = function (){
        viewportSize.init();
        viewportAnimation.init();
        $(document).ready(function(){
            initInnerOuterSwitch();
            initResolutionDropDown();
            initAnimation();
            initWidthScrollBar();
            initHeightScrollBar();
        });
    };

    return {
        init: init,
        initData: initData
    }
});
