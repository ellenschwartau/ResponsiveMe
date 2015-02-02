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

    return {
        list: list,
        parser: parser
    };
});
