/**
 * Stellt übrgreifend nützliche Funktionen bereit.
 */
define([

], function(){

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

    return {
        list: list
    };
});
