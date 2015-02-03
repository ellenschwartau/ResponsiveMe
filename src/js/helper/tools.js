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
        /**
         * Liest den Wert aus einem Inputfeld aus und konvertiert diesen in einen Integer.
         * @param {$} $element - Element dessen Wert ausgelesen werden soll
         * @returns {int}
         */
        parseIntVal: function($element) {
            return parseInt(Math.round($element.val()));
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
        }
    };

    return {
        list: list,
        parser: parser,
        properties: properties
    };
});
