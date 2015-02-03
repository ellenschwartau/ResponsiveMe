define([
    'jquery', 'modules', 'localStorage', 'tools'
],
/**
 * Die settings.js übernimmt das Initialisieren der Einstellungen und das Behandeln der Änderungen an den
 * Einstellungen. Dazu gehört beispielsweise das Ein- und Ausblenden aller Module und das Aktivieren und Deaktivieren
 * der Beschreibungstexte.
 * @exports settings
 * @param {Object} $ - JQuery
 * @param {module} modules - modules-Modul
 * @see module:modules
 * @param {module} localStorage - localStorage-Modul
 * @see modules:localStorage
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @returns {{init: Function}}
 */
function($, modules, localStorage, tools) {
    var $content = $("#popup-content"),                             // Wrapper-Element für den Content
        $footer = $("#popup-footer"),                               // Wrapper-Element für den Footer
        $settings = $footer.find(".settings"),                      // Formular, das die Settings enthält
        $showDescriptionsCb = $settings.find("#showDescriptionCb"), // Checkbox für die Anzeige der Beschreibungen
        $showAllModulesCb = $settings.find("#showAllModulesCb");    // Checkboc für die Anzeige der Module

    /**
     * Ein- und Ausblenden der Einstellungen bei Klick auf das Einstelluns-Icon im Footer.
     */
    var initSettingsDisplay = function() {
        $footer.find(".settings-icon").click(function() {
            $settings.toggle("slow");
            if(tools.properties.isVisible($settings)) {
                $settings.css("display", "inline-block");
            }
        });
    };

    /**
     * Ein- und Ausblenden der Hinweise über die Checkbox ermöglichen.
     */
    var initDescriptionToggle = function() {
        $showDescriptionsCb.change(function(){
            $content.find(".module").each(function(i, item) {
                if(tools.properties.isChecked($showDescriptionsCb)) {
                    modules.setSlideCallbacks($(item));
                } else {
                    modules.resetSlideCallbacks($(item));
                }
            });
        });
    };

    /**
     * Ein- und Ausblenden der Modul-Inhalte über die Einstellungen.
     */
    var initModuleToggle = function() {
        $showAllModulesCb.change(function(){
            $content.find(".module").each(function(i, item) {
                var $item = $(item);
                if(tools.properties.isChecked($showAllModulesCb)) {
                    $item.find(".module-content").slideDown("slow");
                    modules.resetSlideCallbacks($item);
                    $item.addClass(modules.activeClass);
                } else {
                    $item.find(".module-content").slideUp("slow");
                    modules.setSlideCallbacks($item);
                    $item.removeClass(modules.activeClass);
                }
            });
        });
    };

    /**
     * Liest die zuletzt gemachten Einstellungen aus der Local Storage aus.
     */
    var readStorageValues = function(){
        var initCb = function($element, value){
            $element.prop('checked', value);
        };
        localStorage.readStorage($showAllModulesCb, localStorage.keys.settings.toggleModules, initCb);
        localStorage.readStorage($showDescriptionsCb, localStorage.keys.settings.toggleHints, initCb);
    };

    /**
     * Setzt das Speichern der Einstellungen in der Local Storage, falls diese geändert werden.
     */
    var registerStorageValues = function(){
        localStorage.registerStorage($showAllModulesCb, localStorage.keys.settings.toggleModules, function(){
            return tools.properties.isChecked($showAllModulesCb);
        });
        localStorage.registerStorage($showDescriptionsCb, localStorage.keys.settings.toggleHints, function(){
            return tools.properties.isChecked($showDescriptionsCb);
        });
    };

    /**
     * Initialisiert die Funktionen der Einstellungen.
     * Dazu gehört das Ein- und Ausblenden der Settings über das Settings Icon,
     * das Aktivieren und Deaktivieren der Beschreibungen der Module
     * und das Ein- und Ausblenden der Modul-Inhalte.
     */
    var initSettings = function() {
        initSettingsDisplay();
        initDescriptionToggle();
        initModuleToggle();
        readStorageValues();
        registerStorageValues();
    };

    return {
        init: initSettings
    };
});