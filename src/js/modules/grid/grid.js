define([
    'jquery', 'visualizeElements', 'localStorage', 'tools'
],
/**
 * Visualisiert das Grid, auf dem eine Website beruht.
 * Dieses Grid kann durch die Angabe mehrerer CSS-Selektoren angegeben werden.
 *
 * Zur Anzeige des Grids können auch reguläre Ausdrücke verwendet werden, z.B.:
 * "div[class^='column-'],div[class*=' column-']" // Alle Klassen, die mit "column-" beginnen oder " column-" beinhalten
 * oder
 * "div[class*='column-']"  // Alle Klassem, die "column-" beinhalten
 *
 * @exports grid
 * @param {Object} $ - JQuery
 * @param {module} visualizeElements - visualizeElements-Modul
 * @param {visualizeElements} visualizeElements - visualizeElements-Modul
 * @param {module} localStorage - localStorage-Modul
 * @see modules:localStorage
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @returns {{init: Function}}
 */
function($, visualizeElements, localStorage, tools) {
    var $contentWrapper,        // Parent Element des Grid Contents
        $addSelectorButton,     // Button zum Hinzufügen von Selektoren
        $showGridButton,        // Button zum Anzeigen des Grids
        $gridColor,             // Eingabe-Feld zu Angabe der Darstellungsfarbe
        $gridWidth,             // Eingabe-Feld zur Angabe der Anzeigebreite
        inputSelectors = "input[type=text]";    // Selektor zur Identifizierung der angegebenen Selektoren

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
            var $lastInput = $contentWrapper.find(inputSelectors).last();
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
                visualizeElements.triggerShowElements(selectors, getColor(), getWidth());
            }
        });
    };

    /**
     * Liest die angegebenen Selektoren aus, die das Grid definierten.
     * @returns {Array}
     */
    var getGridSelectors = function() {
        var inputFields =  $contentWrapper.find(inputSelectors),
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
     * @return {string}
     */
    var getColor = function() {
        return $gridColor.val();
    };

    /**
     * Liefert die Breite, in der das Grid dargestellt werden soll.
     * @returns {Number}
     */
    var getWidth = function() {
        return tools.parser.parseIntVal($gridWidth);
    };

    /**
     * Liest die Benutzereingaben aus der Local Storage aus.
     */
    var readStorageValues = function(){
        localStorage.readStorage($gridWidth, localStorage.keys.grid.width);
        localStorage.readStorage($gridColor, localStorage.keys.grid.color);
    };

    /**
     * Registriert die Callbacks zum speichern der Benutzereingaben.
     */
    var initStorageUpdate = function(){
        localStorage.registerStorage($gridWidth, localStorage.keys.grid.width, getWidth, 0);
        localStorage.registerStorage($gridColor, localStorage.keys.grid.color, getColor);
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
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
        initStorageUpdate();
        readStorageValues();
    };

    return {
        init: init
    };
});