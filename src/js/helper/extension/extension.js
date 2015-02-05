define([
        'extensionEvents', 'extensionMessagePassing', 'extensionStorage', 'extensionComponents'
],
/**
 * Stellt verschiedene Funktionen bereit, um zwischen Browser und Erweiterung zu kommunizieren.
 * Dient als Wrapper-Modul für die Funktionalitäten die die chrome.*-API bereitstellt
 * und kapselt die Funktionen der verschiedenen extension-*-Hilfsmodule.
 * @exports extension
 * @param {module} extensionEvents - extensionEvents-Modul
 * @see modules:extensionEvents
 * @param {module} extensionMessagePassing - extensionMessagePassing-Modul
 * @see modules:extensionMessagePassing
 * @param {module} extensionStorage - extensionStorage-Modul
 * @see modules:extensionStorage
 * @param {module} extensionComponents - extensionComponents-Modul
 * @see modules:extensionComponents
 * @returns {{sendMessage: Function, sendMessageToTab: Function, sendMessageToTabWithCb: Function, handleMessage: Function, executeScriptCode: Function, getBackgroundPage: Function, saveStorageValue: Function, getStorageValue: Function, removeStorageValue: Function, getCurrentWindow: Function, onActivatedTab: (*|exports.onActivatedTab), onAttachedTab: (*|exports.onAttachedTab), onFocusChangedWindow: (*|exports.onFocusChangedWindow)}}
 */
function(extensionEvents, extensionMessagePassing, extensionStorage, extensionComponents){
    return {
        executeScriptCodeInTab: extensionComponents.executeScriptCodeInTab,
        getBackgroundPage: extensionComponents.getBackgroundPage,
        getCurrentWindow: extensionComponents.getCurrentWindow,
        saveStorageValue: extensionStorage.saveStorageValue,
        getStorageValue: extensionStorage.getStorageValue,
        removeStorageValue: extensionStorage.removeStorageValue,
        sendMessage: extensionMessagePassing.sendMessage,
        sendMessageToTab: extensionMessagePassing.sendMessageToTab,
        sendMessageToTabWithCb: extensionMessagePassing.sendMessageToTabWithCb,
        handleMessage: extensionMessagePassing.handleMessage,
        onActivatedTab: extensionEvents.onActivatedTab,
        onAttachedTab: extensionEvents.onAttachedTab,
        onFocusChangedWindow: extensionEvents.onFocusChangedWindow
    };
});