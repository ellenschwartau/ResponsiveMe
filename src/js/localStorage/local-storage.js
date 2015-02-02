define([

],
/**
 * Das Local Storage Modul implementiert Logik um benutzerspezifische Angaben zwischenzuspeichern.
 * Dabei wird auf Funktionen der chrome.storage-API zurückgegriffen.
 * @exports localStorage
 * @returns {{save: Function, get: Function}}
 */
function(){
    /**
     * Speichert einen Wert in der chrome.storage.
     * @param {string} key - Schlüssel unter dem der Wert gespeichert werden soll
     * @param {object} value - Wert der gespeichert werden soll
     */
    var save = function(key, value) {
        chrome.storage.sync.set({
            key: value
        });
    };

    /**
     * Liefert einen gespeicherten Wert.
     * @param {string} key - Schlüssel des auszulesenden Wertes
     * @param {function} callback - Funktion, die nach dem Auslesen ausgeführt werden soll
     */
    var get = function(key, callback){
        chrome.storage.sync.get(key, function(result){
            callback(result);
        });
    };

    return {
        save: save,
        get: get
    }
});