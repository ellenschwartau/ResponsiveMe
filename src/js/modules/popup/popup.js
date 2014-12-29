/**
 * Javascript der popup.html - übernimmt das Triggern der Modul-Aktionen sowie deren Ein- und Ausblenden.
 *
 * // TODO ausschließen, dass das html einer anderen Website beeinflusst wird
 *
 */
define(
    ['jquery']
    ,
function($) {
    /** Wrapper-Element, für den Inhalt des Popups */
    var $content = $("#popup-content"),
        $footer = $("#popup-footer"),
        activeClass = "active";

    /**
     * Inkludiert die Module zur Anzeige im Popup.
     */
    var includeModules = function() {
        // Pfad und Namen der Module
        var baseDir = "modules/",
            modules = [
                "viewport.html",
                "template.html",
                "template.html"
            ];
        $.each(modules, function(i, modulePath) {
            $.get(baseDir + modulePath, function(data) {
                var $data = $(data);
                setCallbacks($data);
                $content.append($data);
            });
        });
    };

    /**
     * Markiert ein Element als aktiv oder inaktiv.
     * Zur Kennzeichnung wird die css-Klasse active hinzugefügt oder entfernt.
     * @param $item Element, das markiert werden soll
     */
    var toggleActive = function($item) {
        $item.toggleClass(activeClass);
    };

    /**
     * Ein- und Ausblenden der Einstellungen bei Klick auf das Einstelluns-Icon im Footer.
     */
    var setSettingsCallback = function() {
        var $settings = $footer.find(".settings"),
            $showDescriptionsCb = $settings.find(".showDescriptionCb"),
            $showAllModulesCb = $settings.find(".showAllModulesCb");
        // TODO prüfen warum ohne unbind mehrmals das click event gefeuert wird
        $footer.find(".settings-icon").unbind("click").click(function() {

            $settings.toggle("slow");
            if($settings.is(":visible")) {
                $settings.css("display", "inline-block");
            }
        });

        // Togglen der Hinweise ein-/ausschalten
        $showDescriptionsCb.change(function(){
            $content.find(".module").each(function(i, item) {
                if($showDescriptionsCb.is(":checked")) {
                    setSlideCallbacks($(item));
                } else {
                    resetSlideCallbacks($(item));
                }
            });
        });

        // Alle Module Ein-/Ausblenden
        $showAllModulesCb.change(function(){
            $content.find(".module").each(function(i, item) {
                var $item = $(item);
                if($showAllModulesCb.is(":checked")) {
                    $item.find(".module-content").slideDown("slow");
                    resetSlideCallbacks($item);
                    $item.addClass(activeClass);
                } else {
                    $item.find(".module-content").slideUp("slow");
                    setSlideCallbacks($item);
                    $item.removeClass(activeClass);
                }
            });
        });
    };

    /**
     * Setzt die Callbacks zur Manipulation der Anzeige.
     * Dazu gehört das Ein- und Ausblenden der Beschreibung und des Modulinhalts und der Einstellungen,
     * sowie das Markieren des Moduls als aktiv oder inaktiv.
     * @param $element Element, bei dem die Callbacks registriert werden sollen
     */
    var setCallbacks = function($element) {
        var toggleContent = $element.find(".module-content");
        // Modul-Inhalt ein- und ausblenden
        $element.click(function () {
            toggleContent.slideToggle();
            toggleActive($element);
            setOrUnbindSlideCallbacks($element);
        });
        // Ein- und Ausblenden der Modul-Beschreibung
        setSlideCallbacks($element);
        // Einstellungen
        setSettingsCallback();
    };

    /**
     * Setzt den Callback für das Ein- und Ausblenden der Modul-Beschreibung, wenn mit der Maus über den Modul-Titel
     * gefahren wird.
     * @param $element Element, bei dem die Callbacks registriert werden sollen
     */
    var setSlideCallbacks = function($element) {
        var $settings = $footer.find(".settings"),
            $descriptionCb = $settings.find(".showDescriptionCb"),
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
     * Setzt das einblenden der Modul-Beschreibung bei Hover zurück.
     * @param $element Modul-Element
     */
    var resetSlideCallbacks = function($element) {
        $element.find("h2").unbind('mouseenter mouseleave');
        $element.find(".module-description").slideUp();
    };

    /**
     * Setzt oder entfernt den hover-Callback der Modulbeschreibung.
     * @param $element Element, bei dem die Callbacks registriert oder entfernt werden sollen
     */
    var setOrUnbindSlideCallbacks = function($element) {
        if(!$element.hasClass(activeClass)) {
            setSlideCallbacks($element);
        } else {
            // Ausblenden und Callbacks entfernen
            resetSlideCallbacks($element);
        }
    };

    /**
     * Initialisiert das Popup.
     * Dafür werden die verschiedenen Module in das Popup eingebunden
     * und die Callbacks zur Manipulation der Anzeige gesetzt.
     */
    var init = function () {
        $(document).ready(function () {
            includeModules();
        });
    };

    return {
        init: init
    };
});