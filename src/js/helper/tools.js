define([
],
/**
 * Stellt übrgreifend nützliche Funktionen bereit.
 * @param {Object} $ - JQuery
 * @exports tools
 */
function($){

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
        /**
         * Liefert die Information, ob ein Element sichtbar ist.
         * @param {$} $element - Element, dessen Eigenschaft abgefragt werden soll
         * @returns {boolean}
         */
        isVisible: function($element){
            return $element.is(":visible");
        },
        /**
         * Liefert die Information, ob ein Element angewählt ist.
         * @param {$} $element - Element, dessen Eigenschaft abgefragt werden soll
         * @returns {boolean}
         */
        isChecked: function($element){
            return $element.is(":checked");
        },
        /**
         * Liefert den maximalen Wert eines Elements.
         * @param {$} $element - Element, dessen Eigenschaft abgefragt werden soll
         * @returns {*}
         */
        getMaxValue: function($element){
            return $element.prop('max');
        },
        /**
         * Liefert den maximalen Wert eines Elements.
         * @param {$} $element - Element, dessen Eigenschaft abgefragt werden soll
         * @param {*} value - Wert, der gesetzt werden soll
         * @returns {*}
         */
        setMaxValue: function($element, value) {
            $element.prop('max', value);
        }
    };

    return {
        list: list,
        parser: parser,
        properties: properties
    };
});
