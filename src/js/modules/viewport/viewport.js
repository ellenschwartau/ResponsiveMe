define([
    'jquery', 'config', 'extension', 'viewportSize', 'viewportAnimation', 'backgroundAccess'
],
/**
 * Beinhaltet die Funktionalitäten des Viewport Moduls,
 * zur Betrachtung der Website in den verschiedenen Pixelbreiten.
 * @exports viewport
 * @param {Object} $ - JQuery
 * @param {module} config - config-Modul
 * @see module:config
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} viewportSize - viewportSize-Modul
 * @see module:viewportSize
 * @param {module} viewportAnimation - viewportAnimation-Modul
 * @see module:viewportAnimation
 * @param {module} backgroundAccess - backgroundAccess-Modul
 * @see module:backgroundAccess
 * @returns {{init: Function}}
 */
function($, config, extension, viewportSize, viewportAnimation, backgroundAccess) {
    var $widthScrollBar,                 // Schieberegler zum Skalieren der Breite
        $heightScrollBar,                // Schieberegler zum Skalieren der Höhe
        $resolutionDropdown,             // Dropdown-Element mit vordefinierten Auflösungen
        $animationDurationScrollBar,     // Schieberegler zum Einstellen der Animationsdauer
        $animationStart,                 // Input-Feld zur Angabe der Start-Breite der Animation
        $animationEnd,                   // Input-Feld zur Angabe der End-Breite der Animation
        $animationTimes,                 // Input-Feld zur Angabe das Anzahl an Wiederholungen
        $animationButton,                // Button zum Starten der Animation
        $innerOuterSwitch,               // Checkbox zum Einstellen der Abmessungen als inner oder outer
        $switchOrientationButton,        // Button zum Ändern der Orientierung
        MSG_ANIMATION_DATA_MISSING =     // Fehlermeldung
            "Für eine Animation müssen Start- und Endwert, wie auch die Anzahl an Wiederholungen gesetzt sein.",
        sizesContainBrowserOffset;       // Angabe ob die Browsermaße mit in die Breitenangabe einfließen

    /**
     * Liest die Einstellung aus,ob die Größenangaben inklusive der Browserabmessungen
     * (z.B. Tool- oder Scrolbars) gemacht werden.
     * @returns {boolean}
     */
    var doSizesContainBrowserOffset = function() {
        return $innerOuterSwitch.is(":checked");
    };

    /**
     * Liest die Anfangseinstellung des Inner/Outer-Switch aus und setzt den Wert erneut,
     * wenn die Einstellung geändert wird.
     */
    var initInnerOuterSwitch = function() {
        sizesContainBrowserOffset = doSizesContainBrowserOffset();
        $innerOuterSwitch.change(function() {
            sizesContainBrowserOffset = !sizesContainBrowserOffset;
            viewportSize.toggleInnerOuter(sizesContainBrowserOffset);
        });
    };

    /**
     * Aktualisiert den Wert und die Anzeige einer Scrollbar
     * @param {$} $scrollbar - Scrollbar
     * @param {string} unit - Einheit
     * @param {int} value - Wert
     */
    var updateScrollbarValue = function($scrollbar, value, unit) {
        $scrollbar.val(value);
        $scrollbar.next().html(value + unit);
    };

    /**
     * Initialisiert eine Scrollbar zur Manipulation der Größe eines Browsers.
     * Dazu wird der minimale, maximale und aktuelle Wert der Scrollbar initialisiert,
     * die Anzeige des aktuellen Wertes , sowie die Callbacks zum Ändern der Breite, bzw. Höhe gesetzt.
     * @param {$} $scrollbar - Element ScrollBar
     * @param {int} max - Maximalwert
     * @param {int} min - Minimalwert
     * @param {int} cur - aktueller Wert der Scrollbar
     * @param {boolean} changeWidth - Angabe, ob der Browser in seiner Breite manipuliert werden soll
     * @param {boolean} changeHeight - Angabe, ob der Browser in seiner Höhe manipuliert werden soll
     */
    var initScrollBar = function($scrollbar, max, min, cur, changeWidth, changeHeight) {
        // Werte initialiseren
        $scrollbar.attr('max', max);
        $scrollbar.attr('min', min);
        updateScrollbarValue($scrollbar, cur, "px");

        // Callbacks setzen (Anzeige und Ändern der Bildschirmbreite triggern)
        showScrollBarValue($scrollbar, $scrollbar.next(), "px");
        $scrollbar.change(function() {
            var value = parseInt($(this).val());
            if(changeWidth) {
                viewportSize.calcAndChangeWidth(value, sizesContainBrowserOffset);
            }
            if(changeHeight) {
                viewportSize.calcAndChangeHeight(value, sizesContainBrowserOffset);
            }
        });
    };

    /**
     * Initialisiert die Anzeige des Wertes, der aktuell auf der ScrollBar angezeigt wird.
     * @param {$} $scrollbar - ScrollBar
     * @param {$} $displayElement - Element, das den aktuellen Wert anzeigen soll
     * @param {string} unit - Einheit der Anzeige (z.B. "px")
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
        var max = backgroundAccess.getAvailBrowserSize().width,
            cur = backgroundAccess.getBrowserWidth(sizesContainBrowserOffset);
        initScrollBar(
            $widthScrollBar, max, 1, cur, true, false
        );
    };

    /**
     * Initialisiert den Schieberegeler zur Beeinflussung der Höhe des Browserfenster.
     * Dazu wird der minimal und maximal möglichen Wert, auf den die Höhe des Browserfensters verändert
     * werden kann, gesetzt.Der Initiale Wert wird auf die Mitte des Reglers gesetzt.
     * Auch die benötigten Callbacks werden gesetzt,
     */
    var initHeightScrollBar = function() {
        var max = backgroundAccess.getAvailBrowserSize().height,
            cur = backgroundAccess.getBrowserHeight(sizesContainBrowserOffset);
        initScrollBar(
            $heightScrollBar, max, 1, cur, false, true
        );
    };

    /**
     * Initialisiert das Dropdown mit den vorgefertigten Auflösugnen.
     */
    var initResolutionDropDown = function() {
        // Breite Anpassen, wenn eine bestimmte Auflösungausgewählt wird
        $resolutionDropdown.change(function(){
            var selectedResolution = config.resolutions[$resolutionDropdown.find(":selected").val()];
            viewportSize.calcAndChangeSize(selectedResolution.width, selectedResolution.height, sizesContainBrowserOffset);
        });
    };

    /**
     * Initialisiert den Button zum Tauschen der Orientierung.
     * Bei einem Klick auf diesen Button werden Breite und Höhe des Browser getauscht
     * und die Anzeige auf den Scrollbars aktualisiert.
     */
    var initSwitchOrientationButton = function(){
        $switchOrientationButton.click(function(){
            var browserSize = backgroundAccess.getOuterBrowserSize(),
                newHeight = browserSize.width,
                newWidth = browserSize.height;
            viewportSize.changeSize(newWidth, newHeight);
            // Scrollbars anpassen
            updateScrollbarValue($heightScrollBar, newHeight, "px");
            updateScrollbarValue($widthScrollBar, newWidth, "px");
            // TODO das hier eventuell rausnehmen
        });
    };

    /**
     * Liest den Wert aus einem Inputfeld aus und konvertiert diesen in einen Integer.
     * @param {$} $element - Element dessen Wert ausgelesen werden soll
     * @returns {int}
     */
    var parseIntVal = function($element) {
        return parseInt(Math.round($element.val()));
        // TODO in TOOLS auslagern
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
        // Anzeige des Zeitwertes initialiseren
        showScrollBarValue($animationDurationScrollBar, $animationDurationScrollBar.next(), "s");
        // Callback zum Starten der Animation initialisieren
        $animationButton.click(function(){
            // Angaben auslesen
            var startPx = parseIntVal($animationStart),
                endPx = parseIntVal($animationEnd),
                times = parseIntVal($animationTimes),
                duration = parseIntVal($animationDurationScrollBar);
            if(isNaN(startPx) || isNaN(endPx) || isNaN(times)) {
                // Bei fehlenden Angaben eine Fehlermeldung ausgeben
                alert(MSG_ANIMATION_DATA_MISSING);
            } else {
                // Animation starten
                viewportAnimation.animateWidth(duration, startPx, endPx, times, 0, sizesContainBrowserOffset);
            }
        });
    };

    /**
     * Übernimmt die aktuelle Größe des Browsers zur Anzeige in den Scrollbars.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentBrowserSizeMessage = function(request){
        var data = request.data,
            curHeight = sizesContainBrowserOffset ? data.outerBrowserHeight : data.innerBrowserHeight,
            curWidth = sizesContainBrowserOffset ? data.outerBrowserWidth : data.innerBrowserWidth;
        updateScrollbarValue($heightScrollBar, curHeight, "px");
        updateScrollbarValue($widthScrollBar, curWidth, "px");
        // TODO händisches Setzen bei Größenänderung kann dann rausgenommen werden wenn das hier funktioniert
    };

    /**
     * Verarbeitung der Nachrichten beim Message Passing.
     */
    var handleMessages = function(){
        extension.handleMessage(config.messageTypes.updateBrowserSize, handleCurrentBrowserSizeMessage);
    };

    /**
     * Initialisiert das Markup des Moduls.
     * Dabei werden die vordefinierten Auflösungen geladen.
     */
    var initData = function() {
        // injizieren der Auflösungen
        $.each(config.resolutions, function(index, item){
            $resolutionDropdown.append("<option value='" + index +"'>" + item.name + "</option>");
        });
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        $widthScrollBar = $("#widthScrollBar");
        $heightScrollBar = $("#heightScrollBar");
        $resolutionDropdown = $('#resolutions');
        $animationDurationScrollBar = $('#animationDurationScrollBar');
        $animationStart = $('#animationStart');
        $animationEnd = $('#animationEnd');
        $animationTimes = $('#animationTimes');
        $animationButton = $('#animationButton');
        $innerOuterSwitch = $('#switchInnerOuter');
        $switchOrientationButton = $("#switchOrientationButton");
    };

    /**
     * Initialisiert das Viewport Modul.
     * Dafür werden die Maximalen Abmessungen auf Grundlage der Bildschirmauflösung gesetzt
     * und die entsprechenden Callbacks zur Manipulation des Browserfensters gesetzt.
     */
    var init = function (){
        viewportSize.init();
        viewportAnimation.init();
        initElements();
        initData();
        initInnerOuterSwitch();
        initResolutionDropDown();
        initAnimation();
        initWidthScrollBar();
        initHeightScrollBar();
        initSwitchOrientationButton();
        handleMessages();
    };

    return {
        init: init
    }
});
