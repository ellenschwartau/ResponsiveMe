define([
],
/**
 * Stellt übergreifend nützliche Funktionen bereit.
 * @exports tools
 * @returns {{
 * list: {listContainsValue: Function},
 * parser: {parseToInt: Function, parseMaxIntValue: Function, parseIntVal: Function},
 * properties: {setProperty:Function, isVisible: Function, isChecked: Function, setChecked: Function, getMaxValue: Function, setMaxValue: Function, getMinValue: Function, setMinValue: Function}}}
 */
function(){
    /**
     * Tools zur Bearbeitung von Listen.
     * @type {{listContainsValue: Function}}
     */
    var list = {
        /**
         * Ermittelt, ob ein bestimmter Wert in einer Liste enthalten ist.
         * @param {Array} list - Liste
         * @param {Object} value - Wert
         * @returns {boolean}
         */
        listContainsValue: function(list, value) {
            var listContainsValue = false;
            for(var i=0; i<list.length && !listContainsValue; i++){
                listContainsValue = list[i] === value;
            }
            return listContainsValue;
        }
    };

    /**
     * Tools zum Parsen von Werten.
     * @type {{parseIntVal: Function}}
     */
    var parser = {
        parseToInt: function(value){
            return parseInt(Math.round(value));
        },
        /**
         * Liest den Wert aus einem Inputfeld aus und konvertiert diesen in einen Integer.
         * @param {$} $element - Element dessen Wert ausgelesen werden soll
         * @returns {int}
         */
        parseIntVal: function($element) {
            return parser.parseToInt($element.val());
        },
        /**
         * Liefert den maximalen Wert eines Elements und konvertiert diesen in einen int.
         * @param {$} $element - Element, dessen Eigenschaft abgefragt werden soll
         * @returns {int}
         */
        parseMaxIntValue: function($element){
            return parser.parseToInt(properties.getMaxValue($element));
        }
    };

    /**
     * Tools zum Auslesen von Eigenschaften eines Elements.
     * @type {{isVisible: Function, isChecked: Function}}
     */
    var properties = {
        /** Property checked */
        CHECKED: 'checked',
        /** Abfrage ob ein Element angewählt ist */
        IS_CHECKED: ':checked',
        /** Abfrage ob ein Element sichtbar ist */
        IS_VISIBLE: ':visible',
        /** Property minimaler Wert */
        MIN: 'min',
        /** Property maximaler Wert */
        MAX: 'max',
        /**
         * Setzt eine Eigenschaft eines Elements auf einen bestimmten Wert.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @param {string} prop - Eigenschaft die gesetzt werden soll
         * @param {*} value - Wert der gesetzt werden soll
         */
        setProperty: function($element, prop, value){
            $element.prop(prop, value);
        },
        /**
         * Liefert die Information, ob ein Element sichtbar ist.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @returns {boolean}
         */
        isVisible: function($element){
            return $element.is(properties.IS_VISIBLE);
        },
        /**
         * Liefert die Information, ob ein Element angewählt ist.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @returns {boolean}
         */
        isChecked: function($element){
            return $element.is(properties.IS_CHECKED);
        },
        /**
         * Setzt den checked-Status eines Elements.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @param {*} value - Wert der gesetzt werden soll
         */
        setChecked: function($element, value){
            properties.setProperty($element, properties.CHECKED, value);
        },
        /**
         * Liefert den maximalen Wert eines Elements.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @returns {*}
         */
        getMaxValue: function($element){
            return $element.prop(properties.MAX);
        },
        /**
         * Setzt den maximalen Wert eines Elements.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @param {*} value - Wert der gesetzt werden soll
         * @returns {*}
         */
        setMaxValue: function($element, value) {
            properties.setProperty($element, properties.MAX, value);
        },
        /**
         * Setzt den minimalen Wert eines Elements.
         * @param {$} $element - Element dessen Eigenschaft abgefragt werden soll
         * @param {*} value - Wert der gesetzt werden soll
         * @returns {*}
         */
        setMinValue: function($element, value) {
            properties.setProperty($element, properties.MIN, value);
        }
    };

    return {
        list: list,
        parser: parser,
        properties: properties
    };
});
