require([
    'extension', 'styleEditor'
],
/**
 * Content Script zur Bearbeitung der vorhandenen Styles.
 * @exports csStyles
 * @param {module} extension - extensionModul
 * @see module:extension
 * @param {module} styleEditor - styleEditor-Modul
 * @see module:styleEditor
 */
function(extension, styleEditor) {
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
     * Löscht eine bestimmte CSS-Regel.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {string} request.data.style - Style-Angaben
     * @param {int} request.data.indexStyleSheet - Index des Style Sheets aus der Style Sheet Liste des document
     * @param {int} request.data.indexRule - zu bearbeitende Rule aus der CSSRuleList des Style Sheets
     */
    var handleDeleteStyle = function(request) {
        var data = request.data;
        styleEditor.remove(data.indexStyleSheet, data.indexRule);
    };

    /**
     * Behandelt die Nachrichten, die an das Content Script gesendet werden.
     */
    var handleMessages = function() {
        extension.handleMessage(extension.messageTypes.insertStyle, handleInsertStyle);
        extension.handleMessage(extension.messageTypes.updateStyle, handleUpdateStyle);
        extension.handleMessage(extension.messageTypes.deleteStyle, handleDeleteStyle);
    }();
});
