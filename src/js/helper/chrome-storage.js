define([
    'extension'
],
/**
 * Das Chrome Storage Modul implementiert Logik um benutzerspezifische Angaben zwischenzuspeichern.
 * Dabei wird auf Funktionen der chrome.storage-API zurückgegriffen.
 * @exports chromeStorage
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @returns {{save: Function, get: Function, registerStorage: Function, readStorage: Function, keys: {settings: {toggleModules: string, toggleHints: string}, displayModules: {viewport: string, grid: string, mediaQueries: string}, viewport: {sizesContainBrowserOffset: string, animation: {startWidth: string, endWidth: string, duration: string, times: string}}, grid: {selectors: string, color: string, width: string}}}}
 */
function(extension){
    /**
     * Schlüssel zum Speichern von Daten in und Zugriff auf Werte aus der Chrome Storage.
     * @type {{settings: {toggleModules: string, toggleHints: string}, displayModules: {viewport: string, grid: string, mediaQueries: string}, viewport: {sizesContainBrowserOffset: string, animation: {startWidth: string, endWidth: string, duration: string, times: string}}, grid: {selectors: string, color: string, width: string}}}
     */
    var keys = {
        settings: {
            toggleModules: "toggleModules",
            toggleHints: "toggleHints"
        },
        displayModules: {
            viewport: "displayViewportModule",
            grid: "displayGridModule",
            mediaQueries: "displayMediaQueriesModule"
        },
        viewport: {
            sizesContainBrowserOffset: "viewportSizesContainBrowserOffset",
            animation: {
                startWidth: "animationStartWidth",
                endWidth: "animationEndWidth",
                duration: "animationDuration",
                times: "animationTimes"
            }
        },
        grid: {
            selectors: "gridSelectors",
            color: "gridColor",
            width: "gridWidth"
        }
    };

    /**
     * Speichert einen Wert in der Chrome Storage.
     * @param {string} key - Schlüssel unter dem der Wert gespeichert werden soll
     * @param {object} value - Wert, der gespeichert werden soll
     */
    var saveValue = function(key, value) {
        var data = {};
        data[key] = value; // Um key variabel zu machen - {key: value} würde als Schlüssel 'key' erzeugen
        extension.saveStorageValue(data);
    };

    /**
     * Liefert einen gespeicherten Wert.
     * @param {string} key - Schlüssel des auszulesenden Wertes
     * @param {function} callback - Funktion, die nach dem Auslesen ausgeführt werden soll
     */
    var getValue = function(key, callback){
        extension.getStorageValue(key, callback);
    };

    /**
     * Löscht einen Wert aus der Chrome Storage.
     * @param {string} key - Schlüssel des zu löschenden Wertes
     */
    var removeValue = function(key){
        extension.removeStorageValue(key);
    };

    /**
     * Registriert das Speichern des aktuellen Wertes, wenn sich dieser ändert.
     * @param {$} $element - Element, dessen Wert gespeichert werden soll
     * @param {string} key - Schlüssel, unter dem der Wert gespeichert werden soll
     * @param {function} getValueCallback - Funktion zum Auslesen des Wertes
     * @param {Object} deleteValue - Wert, bei dem der Eintrag gelöscht werden soll
     */
    var registerStorage = function($element, key, getValueCallback, deleteValue){
        $element.change(function(){
            var value = getValueCallback();
            if (value !== deleteValue) {
                saveValue(key, getValueCallback());
            } else {
                removeValue(key);
            }
        });
    };

    /**
     * Liest einen Wert aus der Chrome Storage aus und setzt diesen bei dem übergebenen Element.
     * @param {$} $element - Element, in dem der Wert gesetzt werden soll
     * @param {string} key - Schlüssel des Wertes, der ausgelesen werden soll
     * @param {function} setCallback - optionaler Callback zur Verarbeitung des Ergebnisses
     */
    var readStorage = function($element, key, setCallback){
        getValue(key, function(result){
            var value = result[key];
            if(setCallback != undefined){
                // Wenn benutzerdefinierte Set-Funktion vorhanden, diese nutzen
                setCallback($element, value);
            } else {
                // Default: Wert über val()-Methode des Elements setzen
                $element.val(value);
            }
        });
    };

    return {
        save: saveValue,
        get: getValue,
        registerStorage: registerStorage,
        readStorage: readStorage,
        keys: keys
    }
});