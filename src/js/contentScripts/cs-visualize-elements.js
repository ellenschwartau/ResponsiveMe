require([
    'extension', 'visualizeElements', 'config'
],
/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 * Behandelt die Visualisierung verschiedener Elemente.
 * @exports messageHandling
 * @param {module} extension - extensionModul
 * @see module:extension
 * @param {module} visualizeElements - visualizeElements-Modul
 * @see module:visualizeElements
 * @param {module} config - config-Modul
 * @see module:config
 */
    function(extension, visualizeElements, config) {
    /**
     * Visualisiert die gewünschten Elemente durch eine Umrandung.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {string[]} request.data.selectors - Selektoren der Elemente, die angezeigt werden sollen
     * @param {string} request.data.color - Farbe der Umrandung
     * @param {int} request.data.width - Breite der Umrandung
     */
    var handleShowElements = function(request) {
        visualizeElements.show(request.data.selectors, request.data.color, request.data.width);
    };

    /**
     * Behandelt die Nachrichten, die an das Content Script gedenset werden.
     */
    var handleMessages = function() {
        extension.handleMessage(config.messageTypes.showElements, handleShowElements);
    }();
});
