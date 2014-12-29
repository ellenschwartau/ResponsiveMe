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
     * Setzt die Callbacks zur Manipulation der Anzeige.
     * Dazu gehört das Ein- und Ausblenden der Beschreibung und des Modulinhalts,
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
    };

    /**
     * Setzt den Callback für das Ein- und Ausblenden der Modul-Beschreibung, wenn mit der Maus über den Modul-Titel
     * gefahren wird.
     * @param $element Element, bei dem die Callbacks registriert werden sollen
     */
    var setSlideCallbacks = function($element) {
        var toggleDescription = $element.find(".module-description");
        // Beschreibung ein- und ausblenden wenn die Überschrift gehovert wird
        $element.find("h2").hover(function() {
            toggleDescription.slideDown();
        }, function() {
            toggleDescription.slideUp();
        });
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
            $element.find("h2").unbind('mouseenter mouseleave');
            $element.find(".module-description").slideUp();
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