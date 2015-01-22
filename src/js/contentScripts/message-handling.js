/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 * Behandelt die Messages und führt die gewünschten Aktionen aus.
 */
require([
    'jquery', 'extension', 'visualizeElements', 'config', 'mediaQueries', 'styleEditor'
],
function($, extension, visualizeElements, config, mediaQueries, styleEditor) {
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
     * Liest die Media Queries aus den Style Sheets aus.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {MessageSender} sender - Enthält Informationen über den Absender
     * @param {function} sendResponse - Funktion zum Absenden einer Antwort
     */
    var handleShowMediaQueries = function(request, sender, sendResponse) {
        sendResponse({
            data: mediaQueries.get()
        });
    };

    /**
     * Fügt eine neue CSS-Regel hinzu.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {string} request.data.style - Style-Angaben
     * @param {int} request.data.indexStyleSheet - Index des Style Sheets aus der Style Sheet Liste des document
     */
    var handleInsertStyle = function(request) {
        var data = request.data;
        styleEditor.insert(data.style, data.indexStyleSheet, 0);
    };

    /**
     * Ändert eine bestehende CSS-Regel ab.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {string} request.data.style - Style-Angaben
     * @param {int} request.data.indexStyleSheet - Index des Style Sheets aus der Style Sheet Liste des document
     * @param {int} request.data.indexRule - zu bearbeitende Rule aus der CSSRuleList des Style Sheets
     */
    var handleUpdateStyle = function(request) {
        var data = request.data;
        styleEditor.update(data.style, data.indexStyleSheet, data.indexRule);
    };

    /**
     * Behandelt die Nachrichten, die an das Content Script gedenset werden.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {MessageSender} sender - Enthält Informationen über den Absender
     * @param {function} sendResponse - Funktion zum Absenden einer Antwort
     */
    var handleMessages = function(request, sender, sendResponse) {
        // Nur eine Antwort kann pro document gesendet werden
        // deswegen muss die Unterscheidung des Types hier passieren
        // nicht erst in der extension.handleMessage Methode
        switch(request.type) {
            case config.messageTypes.showElements:
                handleShowElements(request);
                break;
            case config.messageTypes.showMediaQueries:
                handleShowMediaQueries(request, sender, sendResponse);
                break;
            case config.messageTypes.insertStyle:
                handleInsertStyle(request);
                break;
            case config.messageTypes.updateStyle:
                handleUpdateStyle(request);
                break;
        }
    };

    extension.handleMessage(handleMessages);

    // TODO Anzeige IST-Zustand
    // TODO Info bei Browseränderung
});
