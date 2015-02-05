define([],
/**
 * Kapselt Funktionen der Erweiterung zum Speichern, Auslesen und Bearbeiten von Daten in der chrome.storage.
 * @exports extensionStorage
 * @returns {{saveStorageValue: Function, getStorageValue: Function, removeStorageValue: Function}}
 */
function(){
    /**
     * Speichert einen Wert in der chrome.storage.
     * @param {json} data - Daten, die gespeichert werdens sollen (Key-Value-Paare)
     */
    var saveStorageValue = function(data){
        chrome.storage.sync.set(data);
    };

    /**
     * Liefert einen gespeicherten Wert.
     * @param {string} key - Schlüssel des auszulesenden Wertes
     * @param {function} callback - Funktion, die nach dem Auslesen ausgeführt werden soll
     */
    var getStorageValue = function(key, callback){
        chrome.storage.sync.get(key, function(result){
            if(!$.isEmptyObject(result)){
                callback(result);
            }
        });
    };

    /**
     * Löscht einen Eintrag aus der Storage.
     * @param {string} key - Schlüssel, der zu löschenden Daten
     */
    var removeStorageValue = function(key){
        chrome.storage.sync.remove(key);
    };

    return {
        saveStorageValue: saveStorageValue,
        getStorageValue: getStorageValue,
        removeStorageValue: removeStorageValue
    };
});