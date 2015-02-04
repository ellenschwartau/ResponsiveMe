define([
    'jquery'
],
/**
 * Dieses Modul enthält übergreifende Funktionen für Content Skripte.
 * @exports csCommons
 * @param {Object} $ - JQuery
 */
function($){
    /**
     * Registriert eine Callback Funktion, die aufgerufen werden soll, wenn der Fokus eines Fensters sich ändert.
     * Dient beispielsweise der Aktualisierung bestimmter Werte in der Hintergrundseite, wenn ein anderer Tab ausgewählt wird.
     * @param {function} callback - Funktion, die aufgerufen werden soll
     */
    var registerTabFocusChanges = function(callback){
        //window.addEventListener("focus", function(e){
        //   callback();
        //}, true);
        //window.onfocus = function(){
        //    callback();
        //}
        //chrome.tabs.onActivated.addListener(callback);
    };

    return {
        registerTabFocusChanges: registerTabFocusChanges
    };
});
