/**
 * Die module.js behandelt das Einbinden der Module und registriert die Callbacks zur Manipulation der Anzeige.
 */
define([
    'jquery', 'config', 'viewport', 'mediaQueries', 'grid'
],
function($, config, viewport, mediaQueries, grid) {
    var activeClass = "active";     // CSS-Klasse zum Markien eines aktiven Moduls

    /**
     * Inkludiert die Module zur Anzeige im Popup.
     */
    var includeModules = function($parentElement) {
        $.each(config.modules, function(i, modulePath) {
            var paths = modulePath.split("/"),
                moduleName = paths[paths.length-1];
            $.get(config.baseDir + modulePath + ".html", function(data) {
                var $data = $(data);
                initModuleDisplay($data);
                $parentElement.append($data);
            }).done(function() {
                // Initialisieren, wenn fertig geladen
                initModule(moduleName);
            });
        });
    };

    /**
     * Initialisiert die Anzeige und die Daten der Module.
     * @param moduleName String Name des Moduls
     */
    var initModule = function(moduleName){
        console.log("Modul " + moduleName + " geladen.");
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
     * @param $element Modul-Element
     */
    var toggleActive = function($element) {
        $element.toggleClass(activeClass);
    };

    /**
     * Initialisiert die Anzeige der Module und setzt die benötigten Callbacks.
     * Dazu gehört das Ein- und Ausblenden der Beschreibung und des Modulinhalts und der Einstellungen,
     * sowie das Markieren des Moduls als aktiv oder inaktiv.
     * @param $element Element, bei dem die Callbacks registriert werden sollen
     */
    var initModuleDisplay = function($element) {
        var toggleContent = $element.find(".module-content");
        // Modul-Inhalt ein- und ausblenden
        $element.find("h2").click(function () {
            toggleContent.slideToggle();
            toggleActive($element);
            toggleModuleDescriptionDisplay($element);
        });
        // Ein- und Ausblenden der Modul-Beschreibung
        initModuleDescriptionDisplay($element);
    };

    /**
     * Setzt den Callback für das Ein- und Ausblenden der Modul-Beschreibung, wenn mit der Maus über den Modul-Titel
     * gefahren wird.
     * @param $element Element, bei dem die Callbacks registriert werden sollen
     */
    var initModuleDescriptionDisplay = function($element) {
        var $settings = $("#popup-footer").find(".settings"),
            $descriptionCb = $settings.find("#showDescriptionCb"),
            shouldDisplayDescriptions = $descriptionCb.is(":checked"),
            toggleDescription = $element.find(".module-description");
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
     * Deaktiviert die Anzeige der Modulbeschreibungen und setzt dafür das Einblenden der
     * Modul-Beschreibung bei Hover zurück.
     * @param $element Modul-Element
     */
    var disableModuleDescriptionDisplay = function($element) {
        $element.find("h2").unbind('mouseenter mouseleave');
        $element.find(".module-description").slideUp();
    };

    /**
     * Aktiviert oder Deaktiviert die Anzeige der Modul-Beschreibungen und
     * setzt oder entfernt dafür den hover-Callback der Modulbeschreibung.
     * @param $element Modul-Element
     */
    var toggleModuleDescriptionDisplay = function($element) {
        if(!$element.hasClass(activeClass)) {
            initModuleDescriptionDisplay($element);
        } else {
            disableModuleDescriptionDisplay($element);
        }
    };

    return {
        init: includeModules,
        setSlideCallbacks: initModuleDescriptionDisplay,
        resetSlideCallbacks: disableModuleDescriptionDisplay,
        activeClass: activeClass
    };
});