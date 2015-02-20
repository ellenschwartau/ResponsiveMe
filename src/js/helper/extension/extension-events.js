define([],
/**
 * Kapselt Funktionen zur Behandlung verschiedener Events.
 * @exports extensionEvents
 * @returns {{onActivatedTab: Function, onAttachedTab: Function, onFocusChangedWindow: Function}}
 */
function(){
    /**
     * Registriert einen Callback, der aufgerufen wird, wenn ein anderer Tab fokussiert wird.
     * @param {function} callback - Funktion, die aufgerufen werden soll
     */
    var onActivatedTab = function(callback){
        chrome.tabs.onActivated.addListener(callback);
    };

    /**
     * Registriert einen Callback, der aufgerufen wird, wenn ein anderer Tab fokussiert wird.
     * @param {function} callback - Funktion, die aufgerufen werden soll
     */
    var onAttachedTab = function(callback){
        chrome.tabs.onAttached.addListener(callback);
    };

    /**
     * Registriert einen Callback, der aufgerufen wird, wenn ein anderes Fenster fokussiert wird.
     * @param {function} callback - Funktion, die aufgerufen werden soll
     */
    var onFocusChangedWindow = function(callback){
        chrome.windows.onFocusChanged.addListener(callback);
    };

    return {
        onActivatedTab: onActivatedTab,
        onAttachedTab: onAttachedTab,
        onFocusChangedWindow: onFocusChangedWindow
    };
});