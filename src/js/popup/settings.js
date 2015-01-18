/**
 * Die settings.js übernimmt das Initialisieren der Einstellungen und das Behandeln der Änderungen an den
 * Einstellungen. Dazu gehört beispielsweise das Ein- und Ausblenden aller Module und das Aktivieren und Deaktivieren
 * der Beschreibungstexte.
 */
define([
    'jquery', 'modules'
],
function($, modules) {
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
            if($settings.is(":visible")) {
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
                if($showDescriptionsCb.is(":checked")) {
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
                if($showAllModulesCb.is(":checked")) {
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
     * Initialisiert die Funktionen der Einstellungen.
     * Dazu gehört das Ein- und Ausblenden der Settings über das Settings Icon,
     * das Aktivieren und Deaktivieren der Beschreibungen der Module
     * und das Ein- und Ausblenden der Modul-Inhalte.
     */
    var initSettings = function() {
        initSettingsDisplay();
        initDescriptionToggle();
        initModuleToggle();
    };

    return {
        init: initSettings
    };
});