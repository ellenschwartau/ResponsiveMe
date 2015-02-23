define([
    'jquery', 'visualizeElements', 'chromeStorage', 'tools', 'config'
],
/**
 * Dient der Visualisierung ders zugrundeliegenden Rasters einer Website,
 * dessen Elemente durch die Angabe von CSS-Selektoren spezifiziert werden können.
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
 * @param {module} chromeStorage - chromeStorage-Modul
 * @see module:chromeStorage
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @param {module} config - config-Modul
 * @see module:config
 * @returns {{init: Function}}
 */
function($, visualizeElements, chromeStorage, tools, config) {
    var $contentWrapper,        // Parent-Element des Grid Contents
        $addSelectorButton,     // Button zum Hinzufügen von Selektoren
        $showGridButton,        // Button zur Anzeige des Grids
        $gridColor,             // Eingabe-Feld zur Angabe der Darstellungsfarbe
        $gridWidth,             // Eingabe-Feld zur Angabe der Anzeigebreite
        INPUT_SELECTORS = "input[type=text]";    // Selektor zur Identifizierung der angegebenen Selektoren

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
        var inputFields =  $contentWrapper.find(INPUT_SELECTORS),
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
     * Liefert das letzte Input-Element des Moduls.
     * @returns {*}
     */
    var getLastInputElement = function(){
        return $contentWrapper.find(INPUT_SELECTORS).last();
    };

    /**
     * Dupliziert das letzte Input-Element zur Angabe eines weiteren Selektors.
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
            // Anzeige anstoßen, wenn Selektoren angegeben wurden
            if(selectors.length >= 1) {
                visualizeElements.triggerShowElements(selectors, getColor(), getWidth());
            }
        });
    };

    /**
     * Setzt die Default Farbe des Grids.
     */
    var initDefaultColor = function(){
        $gridColor.val(config.defaultGridColor);
    };
    /**
     * Liest die letzten Benutzereingaben aus der Chrome Storage aus.
     */
    var readStorageValues = function(){
        chromeStorage.readStorage($gridWidth, chromeStorage.keys.grid.width);
        chromeStorage.readStorage($gridColor, chromeStorage.keys.grid.color);
        chromeStorage.readStorage(getLastInputElement(), chromeStorage.keys.grid.selectors);
    };

    /**
     * Registriert die Callbacks zum Speichern der Benutzereingaben.
     */
    var initStorageUpdate = function(){
        chromeStorage.registerStorage($gridWidth, chromeStorage.keys.grid.width, getWidth, 0);
        chromeStorage.registerStorage($gridColor, chromeStorage.keys.grid.color, getColor);
        chromeStorage.registerStorage(getLastInputElement(), chromeStorage.keys.grid.selectors, getLastSelectorValue, "");
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
        initDefaultColor();
        initStorageUpdate();
        readStorageValues();
        initAddSelectorButton();
        initShowGrid();
    };

    return {
        init: init
    };
});