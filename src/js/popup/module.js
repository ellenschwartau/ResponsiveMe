define([
    'jquery', 'config', 'viewport', 'mediaQueries', 'grid', 'chromeStorage', 'tools'
],
/**
 * Dieses Modul behandelt das Einbinden und Initialisieren der Module
 * und registriert die Callbacks zur Manipulation der Anzeige.
 * @exports modules
 * @param {Object} $ - JQuery
 * @param {module} config - config-Modul
 * @see module:config
 * @param {module} viewport - viewport-Modul
 * @see module:viewport
 * @param {module} mediaQueries - mediaQueries-Modul
 * @see module:mediaQueries
 * @param {module} grid - grid-Modul
 * @see module:grid
 * @param {module} chromeStorage - chromeStorage-Modul
 * @see module:chromeStorage
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @returns {{init: Function, setSlideCallbacks: Function, resetSlideCallbacks: Function, activeClass: string}}
 */
function($, config, viewport, mediaQueries, grid, chromeStorage, tools) {
    /**
     * Benötigte CSS-Klassen und HTML-Elemente
     */
    var ACTIVE_MODULE_CLASS = "active",                     // CSS-Klasse zur Markierung eingeblendeter Module
        MODULE_DESCRIPTION = ".module-description",         // Selektor der Modul-Beschreibung
        $descriptionCb = $("#showDescriptionCb");  // Checkbox zur Beeinflussung der Beschreibungen

    /**
     * Inkludiert die in der Konfiguration aufgelisteten Module und hängt diese an das übergebene Element an.
     * Sobald diese fertig geladen sind, werden die allgemeinen Callbacks initialisert
     * und die Modul-spezifische Initialisierung ausgeführt.
     * @param {$} $parentElement - Element, an das das Markup der Module angehängt werden soll
     */
    var includeModules = function($parentElement) {
        $.each(config.modules, function(i, modulePath) {
            var paths = modulePath.split("/"),
                moduleName = paths[paths.length-1];
            $.get(config.baseDir + modulePath + ".html", function(data) {
                var $data = $(data);
                initModuleDisplay(moduleName, $data);
                $parentElement.append($data);
            }).done(function() {
                // Initialisieren, wenn fertig geladen
                initModule(moduleName);
            });
        });
    };

    /**
     * Deaktiviert die Anzeige der Modulbeschreibungen und setzt dafür das Einblenden der
     * Modul-Beschreibung bei Hover zurück.
     * @param {$} $element - Modul-Element
     */
    var disableModuleDescriptionDisplay = function($element) {
        $element.find("h2").unbind('mouseenter mouseleave');
        $element.find(".module-description").slideUp();
    };

    /**
     * Aktiviert oder Deaktiviert die Anzeige der Modul-Beschreibungen und
     * setzt oder entfernt dafür den hover-Callback der Modulbeschreibung.
     * @param {$} $element - Modul-Element
     */
    var toggleModuleDescriptionDisplay = function($element) {
        if(!$element.hasClass(ACTIVE_MODULE_CLASS)) {
            initModuleDescriptionDisplay($element);
        } else {
            disableModuleDescriptionDisplay($element);
        }
    };

    /**
     * Initialisiert die Anzeige und die Daten der Module.
     * @param {string} moduleName - Name des Moduls
     */
    var initModule = function(moduleName){
        switch(moduleName) {
            case "viewport":
                viewport.init();
                break;
            case "grid":
                grid.init();
                break;
            case "media-queries":
                mediaQueries.init();
                break;
        }
    };

    /**
     * Markiert ein Modul als aktiv oder inaktiv.
     * @param {$} $element - Modul-Element
     */
    var toggleActive = function($element) {
        $element.toggleClass(ACTIVE_MODULE_CLASS);
    };

    /**
     * Liefert den Schlüssel, unter dem die Anzeige-Eigenschaft des Moduls in der Chrome Storage gespeichert ist.
     * @param {string} moduleName - Name des aktuellen Moduls
     * @returns {string}
     */
    var getStorageKeyForModule = function(moduleName){
        switch(moduleName){
            case "viewport":
                return chromeStorage.keys.displayModules.viewport;
            case "grid":
                return chromeStorage.keys.displayModules.grid;
            case "media-queries":
                return chromeStorage.keys.displayModules.mediaQueries;
        }
    };

    /**
     * Speichert die Anzeige-Eigenschaft des Moduls in der Chrome Storage.
     * @param {string} key - Schlüssel zum Speichern und Auslesen der Anzeigeeinstellung aus der Local Storage
     * @param {$} $content - Element, bei dem die Callbacks registriert werden sollen
     */
    var saveModuleDisplay = function(key, $content){
        var isVisible = $content.is(":visible");
        chromeStorage.save(key, isVisible);
    };

    /**
     * Liest die letzte Anzeige-Einstellung aus der Chrome Storage aus.
     * @param {string} key - Schlüssel zum Speichern und Auslesen der Anzeigeeinstellung aus der Local Storage
     * @param {$} $content - Element, dessen Anzeige-Einstellung bestimmt werden soll
     */
    var readModuleDisplay = function(key, $content){
        chromeStorage.get(key, function(result){
            if(result[key]){
                $content.show();
                toggleActive($content.parent());
            }
        });
    };

    /**
     * Initialisiert das Ein- und Ausblenden des Modulinhalts.
     * Der initiale Anzeigewert wird aus der Chrome Storage ausgelesen.
     * @param {string} moduleName - Name des Moduls, das initialisiert werden soll
     * @param {$} $element - Element, bei dem die Callbacks registriert werden sollen
     */
    var initToggleContent = function(moduleName, $element){
        var $toggleContent = $element.find(".module-content"),
            key = getStorageKeyForModule(moduleName);
        // initiale Anzeige bestimmen
        readModuleDisplay(key, $toggleContent);
        // Modul-Inhalt bei Klick ein- und ausblenden
        $element.find("h2").click(function () {
            $toggleContent.slideToggle(400, function(){
                // Sichtbarkeit speichern, wenn toggle fertig
                saveModuleDisplay(key, $toggleContent);
            });
            toggleActive($element);
            toggleModuleDescriptionDisplay($element);
        });
    };

    /**
     * Setzt den Callback für das Ein- und Ausblenden der Modul-Beschreibung,
     * wenn mit der Maus über den Modul-Titel gefahren wird.
     * @param {$}  $element - Element, bei dem die Callbacks registriert werden sollen
     */
    var initModuleDescriptionDisplay = function($element) {
        var shouldDisplayDescriptions = tools.properties.isChecked($descriptionCb),
            toggleDescription = $element.find(MODULE_DESCRIPTION);
        if(shouldDisplayDescriptions) {
            // Beschreibung ein- und ausblenden wenn die Überschrift gehovert wird
            $element.find("h2").hover(function() {
                toggleDescription.slideDown();
            }, function() {
                toggleDescription.slideUp();
            });
        }
    };

    /**
     * Initialisiert die Anzeige der Module und setzt die benötigten Callbacks.
     * Dazu gehört das Ein- und Ausblenden der Beschreibung und des Inhalts der Module
     * sowie das Markieren des Moduls als aktiv oder inaktiv.
     * @param {string} moduleName - Name des Moduls
     * @param {$} $element - Element, bei dem die Callbacks registriert werden sollen
     */
    var initModuleDisplay = function(moduleName, $element) {
        initToggleContent(moduleName, $element);
        initModuleDescriptionDisplay($element);
    };

    return {
        init: includeModules,
        setSlideCallbacks: initModuleDescriptionDisplay,
        resetSlideCallbacks: disableModuleDescriptionDisplay,
        activeClass: ACTIVE_MODULE_CLASS
    };
});