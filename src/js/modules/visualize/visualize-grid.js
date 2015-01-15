/**
 * Visualisiert das Grid, auf dem eine Website beruht.
 * Dieses Grid kann durch die Angabe mehrerer CSS-Selektoren angegeben werden.
 */
define([
    'jquery', 'extension', 'config'
],
function($, extension, config) {
    var $contentWrapper,        // Parent Element des Grid Contents
        $addSelectorButton,     // Button zum Hinzufügen von Selektoren
        $showGridButton,        // Button zum Anzeigen des Grids
        $gridColor,             // Eingabe-Feld zu Angabe der Darstellungsfarbe
        $gridWidth;             // Eingabe-Feld zur Angabe der Anzeigebreite

    /**
     * Initialisiert den Button zum Hinzufügen neuer Selektoren.
     * Bei einem Klick auf den Button wird ein neues Input-Element vor dem Button hinzugefügt.
     */
    var initAddSelectorButton = function() {
        // TODO Doku: Keine Delegated Events
        // delegated Event Handling --> http://learn.jquery.com/events/event-delegation/l
        // Um Events bei Elementen zu registrieren, die nachgeladen werden und zum Zeitpunkt der Initialisierung
        // noch nicht vorhanden sind
        $addSelectorButton.click(function(){
            var $lastInput = $contentWrapper.find("input").last();
            $lastInput.after($lastInput.clone());
        });
    };

    /**
     * Initialisiert die Anzeige des Grids.
     */
    var initShowGrid = function() {
        $showGridButton.click(function(){
            var selectors = getGridSelectors();
            // Wenn Selektoren angegeben wurden, Anzeige anstoßen
            if(selectors.length >= 1) {
                extension.sendMessageToTab({
                    type: config.messageTypes.showGrid,
                    data: selectors,
                    color: getColor(),
                    width: getWidth()
                });
            }
        });
    };

    /**
     * Liest die angegebenen Selektoren aus, die das Grid definierten.
     * @returns {Array}
     */
    var getGridSelectors = function() {
        var inputFields =  $contentWrapper.find("input"),
            values = [];
        inputFields.each(function(i, element) {
            var value = element.value;
            if(value !== "") {
                values.push(value);
            }
        });
        return values;
    };

    /**
     * Liefert die Farbe, in der das Grid angezeigt werden soll.
     */
    var getColor = function() {
        return $gridColor.val();
    };

    /**
     * Liefert die Breite, in der das Grid dargestellt werden soll.
     * @returns {Number}
     */
    var getWidth = function() {
        return parseInt($gridWidth.val());
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        // TODO in Konstanten auslagern? Werden nur an dieser Stelle gebraucht..
        $contentWrapper = $("#showGrid");
        $addSelectorButton = $("#addSelectorButton");
        $showGridButton = $("#showGridButton");
        $gridColor = $("#gridColor");
        $gridWidth = $("#gridWidth");
    };

    /**
     * Initialisiert das Grid-Modul.
     * Die benötigten Elemente werden ausgelesen und die Callbacks gesetzt.
     */
    var init = function() {
        initElements();
        initAddSelectorButton();
        initShowGrid();
    };

    return {
        init: init
    };
});