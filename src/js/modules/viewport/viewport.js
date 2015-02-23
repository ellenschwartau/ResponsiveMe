define([
    'jquery', 'config', 'extension', 'viewportSize', 'viewportAnimation', 'backgroundAccess', 'tools', 'chromeStorage'
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
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @param {module} chromeStorage - chromeStorage-Modul
 * @see module:chromeStorage
 * @returns {{init: Function}}
 */
function($, config, extension, viewportSize, viewportAnimation, backgroundAccess, tools, chromeStorage) {
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
            "Für eine Animation müssen alle Felder ausgefüllt werden.",
        $msgElement =                    // Element zur Anzeige der Fehlermeldung bei fehlenden Animationsdaten
            $("<span class='warning'>" + MSG_ANIMATION_DATA_MISSING + "</span>"),
        isAnimationRunning = false,      // Angabe ob zu Zeit eine Animation läuft
        sizesContainBrowserOffset,       // Angabe ob die Browsermaße mit in die Breitenangabe einfließen
        MIN_VALUE_SIZE_SCROLLBARS = 1,   // Mindestwert zum Skalieren des Browsers
        UNIT_PX = "px",                  // String zur Anzeige der Einheit px
        UNIT_S = "s";                    // String zur Anzeige der Einheit s

    /**
     * Liest die Einstellung aus,ob die Größenangaben inklusive der Browserabmessungen
     * (z.B. Tool- oder Scrolbars) gemacht werden.
     * @returns {boolean}
     */
    var doSizesContainBrowserOffset = function() {
        return tools.properties.isChecked($innerOuterSwitch);
    };

    /**
     * Liest die Anfangseinstellung des Inner/Outer-Switch aus und setzt den Wert erneut,
     * wenn die Einstellung geändert wird. Bei Änderungen an dieser Einstellung wird der Browser
     * skaliert und die maximalen Werte der Scrollbars zur Skalierung neu berechnet.
     */
    var initInnerOuterSwitch = function() {
        sizesContainBrowserOffset = doSizesContainBrowserOffset();
        $innerOuterSwitch.change(function() {
            sizesContainBrowserOffset = !sizesContainBrowserOffset;
            viewportSize.toggleInnerOuter(sizesContainBrowserOffset);
            updateMaxScaleValues();
        });
    };

    /**
     * Aktualisiert die maximal-Werte der Scrollbars zur Skalierung des Browsers.
     */
    var updateMaxScaleValues = function(){
        var availBrowserSize = backgroundAccess.getAvailBrowserSize(sizesContainBrowserOffset);
        tools.properties.setMaxValue($widthScrollBar, availBrowserSize.width);
        tools.properties.setMaxValue($heightScrollBar, availBrowserSize.height);
    };

    /**
     * Aktualisiert den Wert einer Scrollbar und dessen Anzeige.
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
     * Dazu wird der minimale, maximale und aktuelle Wert der Scrollbar initialisiert und
     * die Anzeige des aktuellen Wertes sowie die Callbacks zum Ändern der Breite, bzw. Höhe gesetzt.
     * @param {$} $scrollbar - Element ScrollBar
     * @param {int} max - Maximalwert
     * @param {int} min - Minimalwert
     * @param {int} cur - aktueller Wert der Scrollbar
     * @param {boolean} changeWidth - Angabe, ob der Browser in seiner Breite manipuliert werden soll
     * @param {boolean} changeHeight - Angabe, ob der Browser in seiner Höhe manipuliert werden soll
     */
    var initScrollBar = function($scrollbar, max, min, cur, changeWidth, changeHeight) {
        // Werte initialiseren
        tools.properties.setMaxValue($scrollbar, max);
        tools.properties.setMinValue($scrollbar, min);
        updateScrollbarValue($scrollbar, cur, UNIT_PX);

        // Callbacks setzen (Anzeige und Ändern der Bildschirmbreite triggern)
        showScrollBarValue($scrollbar, $scrollbar.next(), UNIT_PX);
        $scrollbar.change(function() {
            var value = tools.parser.parseIntVal($(this));
            if(changeWidth) {
                viewportSize.changeWidth(value, sizesContainBrowserOffset);
            }
            if(changeHeight) {
                viewportSize.changeHeight(value, sizesContainBrowserOffset);
            }
        });
    };

    /**
     * Initialisiert die Anzeige des Wertes, der aktuell auf einer ScrollBar eingestellt ist.
     * @param {$} $scrollbar - ScrollBar
     * @param {$} $displayElement - Element, das den aktuellen Wert anzeigen soll
     * @param {string} unit - Einheit der Anzeige (z.B. "px")
     */
    var showScrollBarValue = function($scrollbar, $displayElement, unit) {
        $scrollbar.mousemove(function() {
            // Anzeige aktualisieren, wenn die Maus darüber bewegt wird
            // (weniger komplex als auf Click + Mousemove, da es hierfür kein Event gibt)
            $displayElement.html(tools.parser.parseIntVal($(this)) + unit);
        });
    };

    /**
     * Initialisiert den Schieberegeler zur Beeinflussung der Breite des Browserfenster.
     * Dazu werden der minimal und maximal möglichen Wert, auf den die Breite des Browserfensters verändert
     * werden kann, gesetzt und die benötigten Callbacks werden gesetzt.
     */
    var initWidthScrollBar = function() {
        var max = backgroundAccess.getAvailBrowserSize(sizesContainBrowserOffset).width,
            cur = backgroundAccess.getBrowserWidth(sizesContainBrowserOffset);
        initScrollBar(
            $widthScrollBar, max, MIN_VALUE_SIZE_SCROLLBARS, cur, true, false
        );
    };

    /**
     * Initialisiert den Schieberegeler zur Beeinflussung der Höhe des Browserfenster.
     * Dazu werden der minimal und maximal möglichen Wert, auf den die Höhe des Browserfensters verändert
     * werden kann, gesetzt und die benötigten Callbacks gesetzt.
     */
    var initHeightScrollBar = function() {
        var max = backgroundAccess.getAvailBrowserSize(sizesContainBrowserOffset).height,
            cur = backgroundAccess.getBrowserHeight(sizesContainBrowserOffset);
        initScrollBar(
            $heightScrollBar, max, MIN_VALUE_SIZE_SCROLLBARS, cur, false, true
        );
    };

    /**
     * Initialisiert das Dropdown mit den vordefinierten Auflösungen.
     */
    var initResolutionDropDown = function() {
        // Breite Anpassen, wenn eine bestimmte Auflösungausgewählt wird
        $resolutionDropdown.change(function(){
            var selectedResolution = config.resolutions[$resolutionDropdown.find(":selected").val()];
            viewportSize.changeSize(selectedResolution.width, selectedResolution.height, sizesContainBrowserOffset);
        });
    };

    /**
     * Initialisiert den Button zum Tauschen der Orientierung des Browsers (Breite und Höhe werden vertauscht).
     */
    var initSwitchOrientationButton = function(){
        $switchOrientationButton.click(function(){
            var browserSize = backgroundAccess.getBrowserSize(sizesContainBrowserOffset);
            viewportSize.changeSize(browserSize.height, browserSize.width, sizesContainBrowserOffset);
        });
    };

    /**
     * Liest die Zielbreite der Animation aus.
     * @returns {Number}
     */
    var getAnimationEndWidth = function(){
        return tools.parser.parseIntVal($animationEnd);
    };

    /**
     * Liest die Startbreite der Animation aus.
     * @returns {Number}
     */
    var getAnimationStartWidth = function(){
        return tools.parser.parseIntVal($animationStart);
    };

    /**
     * Liefert die Anzahl der Wiederholungen der Animationen.
     * @returns {Number}
     */
    var getAnimationTimes = function(){
        return tools.parser.parseIntVal($animationTimes);
    };

    /**
     * Liefert die Dauer der Animation.
     * @returns {Number}
     */
    var getAnimationDuration = function(){
        return tools.parser.parseIntVal($animationDurationScrollBar);
    };

    /**
     * Prüft, ob Informationen zur Animation fehlen.
     * @returns {boolean}
     */
    var isAnimationDataMissing = function(){
        return $animationStart.val() === "" || $animationEnd.val() === "" || $animationTimes.val() === "";
    };

    /**
     * Initialisiert die Animation des Viewports.
     * Bei Betätigung des Animations-Buttons werden die benötigten Daten ausgelesen und die Animation gestartet.
     * Auch die Anzeige des aktuell auf dem Schieberegler der Zeitangabe eingestellten Wertes wird initialisiert.
     */
    var initAnimation = function() {
        showScrollBarValue($animationDurationScrollBar, $animationDurationScrollBar.next(), UNIT_S);
        $animationButton.click(handleAnimationClick);
    };

    /**
     * Behandelt den Klick auf den Animationsbutton.
     * Eine Animation wird gestartet, wenn aktuell keine andere läuft und die benötigten Daten angegeben sind.
     */
    var handleAnimationClick = function(){
        if(!isAnimationRunning){
            // Nur eine Animation Starten wenn gerade keine andere läuft
            if(isAnimationDataMissing()) {
                // Bei fehlenden Angaben eine Fehlermeldung ausgeben
                showMsgAnimationDataMissing();
            } else {
                isAnimationRunning = true;
                // Angaben parsen und Animation starten
                var startPx = getAnimationStartWidth(),
                    endPx = getAnimationEndWidth(),
                    times = getAnimationTimes(),
                    duration = getAnimationDuration();
                viewportAnimation.animateWidth(
                    duration, startPx, endPx, times, 0, sizesContainBrowserOffset
                ).then(
                    function(){
                        // Animationsstatus aktualisieren
                        isAnimationRunning = false;
                    }
                );
            }
            // TODO unbind Event
        }
    };

    /**
     * Blendet eine Fehlermeldung unterhalb der Animation-Buttons ein.
     */
    var showMsgAnimationDataMissing = function(){
        $animationButton.after($msgElement);
        setTimeout(function(){
            $msgElement.remove();
        }, 3500);
    };

    /**
     * Übernimmt die aktuelle Größe des Browsers zur Anzeige in den Scrollbars.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentBrowserSizeMessage = function(request){
        var data = request.data,
            curHeight = sizesContainBrowserOffset ? data.outerBrowserHeight : data.innerBrowserHeight,
            curWidth = sizesContainBrowserOffset ? data.outerBrowserWidth : data.innerBrowserWidth;
        updateScrollbarValue($heightScrollBar, curHeight, UNIT_PX);
        updateScrollbarValue($widthScrollBar, curWidth, UNIT_PX);
    };

    /**
     * Verarbeitung der Nachrichten beim Message Passing.
     */
    var handleMessages = function(){
        extension.handleMessage(extension.messageTypes.updateBrowserSize, handleCurrentBrowserSizeMessage);
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
     * Liest die Benutzereingaben aus der Chrome Storage aus.
     */
    var readStorageValues = function(){
        chromeStorage.readStorage($animationStart, chromeStorage.keys.viewport.animation.startWidth);
        chromeStorage.readStorage($animationEnd, chromeStorage.keys.viewport.animation.endWidth);
        chromeStorage.readStorage($animationTimes, chromeStorage.keys.viewport.animation.times);
        chromeStorage.readStorage($animationDurationScrollBar, chromeStorage.keys.viewport.animation.duration, function($element, value){
            updateScrollbarValue($element, value, UNIT_S);
        });
        chromeStorage.readStorage($innerOuterSwitch, chromeStorage.keys.viewport.sizesContainBrowserOffset, function($element, value){
            // inner/outer-Switch und maximale Werte der Scrollbars aktualisieren
            $element.prop('checked', value);
            sizesContainBrowserOffset = value;
        });
    };

    /**
     * Registriert die Callbacks zum Speichern der Benutzereingaben.
     */
    var initStorageUpdate = function(){
        chromeStorage.registerStorage($animationStart, chromeStorage.keys.viewport.animation.startWidth, getAnimationStartWidth, 0);
        chromeStorage.registerStorage($animationEnd, chromeStorage.keys.viewport.animation.endWidth, getAnimationEndWidth, 0);
        chromeStorage.registerStorage($animationTimes, chromeStorage.keys.viewport.animation.times, getAnimationTimes, 0);
        chromeStorage.registerStorage($animationDurationScrollBar, chromeStorage.keys.viewport.animation.duration, getAnimationDuration);
        chromeStorage.registerStorage($innerOuterSwitch, chromeStorage.keys.viewport.sizesContainBrowserOffset, doSizesContainBrowserOffset);
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
     */
    var init = function (){
        initElements();
        readStorageValues();
        initStorageUpdate();
        initData();
        initInnerOuterSwitch();
        initResolutionDropDown();
        initAnimation();
        initSwitchOrientationButton();
        initWidthScrollBar();
        initHeightScrollBar();
        handleMessages();
    };

    return {
        init: init
    }
});
