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
 * @see module:localStorage
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
     * Liefert das letzte Input-Element des Moduls.
     * @returns {*}
     */
    var getLastInputElement = function(){
        return $contentWrapper.find(inputSelectors).last();
    };

    /**
     * Fügt ein neues Input-Element zur Angabe eines weiteren Selektors hinzu.
     */
    var addNewSelectorInput = function(){
        var $lastInput = getLastInputElement();
        $lastInput.after($lastInput.clone());
    };

    /**
     * Initialisiert den Button zum Hinzufügen neuer Selektoren.
     * Bei einem Klick auf den Button wird ein neues Input-Element vor dem Button hinzugefügt.
     */
    var initAddSelectorButton = function() {
        // Um Events bei Elementen zu registrieren, die nachgeladen werden und zum Zeitpunkt der Initialisierung
        // noch nicht vorhanden sind
        $addSelectorButton.click(addNewSelectorInput);
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
     * Liefert den Inhalt des letzten Input Elements in der Liste der Selektoren.
     * @returns {string}
     */
    var getLastSelectorValue = function(){
        return getLastInputElement()[0].value;
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
        localStorage.readStorage(getLastInputElement(), localStorage.keys.grid.selectors);
    };

    /**
     * Registriert die Callbacks zum speichern der Benutzereingaben.
     */
    var initStorageUpdate = function(){
        localStorage.registerStorage($gridWidth, localStorage.keys.grid.width, getWidth, 0);
        localStorage.registerStorage($gridColor, localStorage.keys.grid.color, getColor);
        localStorage.registerStorage(getLastInputElement(), localStorage.keys.grid.selectors, getLastSelectorValue, "");
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
        initStorageUpdate();
        readStorageValues();
        initAddSelectorButton();
        initShowGrid();
    };

    return {
        init: init
    };
});