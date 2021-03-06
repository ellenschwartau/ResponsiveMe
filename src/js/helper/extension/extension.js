define([
        'extensionEvents', 'extensionMessagePassing', 'extensionStorage', 'extensionComponents'
],
/**
 * Stellt verschiedene Funktionen bereit, um zwischen Browser und Erweiterung zu kommunizieren.
 * Dient als Wrapper-Modul für die Funktionalitäten die die chrome.*-API bereitstellt
 * und kapselt die Funktionen der verschiedenen extension-Hilfsmodule.
 * @exports extension
 * @param {module} extensionEvents - extensionEvents-Modul
 * @see module:extensionEvents
 * @param {module} extensionMessagePassing - extensionMessagePassing-Modul
 * @see module:extensionMessagePassing
 * @param {module} extensionStorage - extensionStorage-Modul
 * @see module:extensionStorage
 * @param {module} extensionComponents - extensionComponents-Modul
 * @see module:extensionComponents
 * @returns {{sendMessage: Function, sendMessageToTab: Function, sendMessageToTabWithCb: Function, handleMessage: Function, executeScriptCode: Function, getBackgroundPage: Function, saveStorageValue: Function, getStorageValue: Function, removeStorageValue: Function, getCurrentWindow: Function, onActivatedTab: Function, onAttachedTab: Function, onFocusChangedWindow: Function}}
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
        handleMessage: extensionMessagePassing.handleMessage,
        messageTypes: extensionMessagePassing.messageTypes,
        onActivatedTab: extensionEvents.onActivatedTab,
        onAttachedTab: extensionEvents.onAttachedTab,
        onFocusChangedWindow: extensionEvents.onFocusChangedWindow
    };
});