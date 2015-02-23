define([
    'jquery', 'stylesheetParser', 'aceHelper', 'styleEditor', 'extension'
],
/**
 * Modul zum Erstellen und Speichern einer neuen Media Query über einen Code-Editor.
 * @exports newMediaQuery
 * @param {Object} $ - JQuery
 * @param {module} stylesheetParser - stylesheetParser-Modul
 * @see module:stylesheetParser
 * @param {module} aceHelper - aceHelper-Modul
 * @see module:aceHelper
 * @param {module} styleEditor - styleEditor-Modul
 * @see module:styleEditor
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @returns {{init: Function, save: Function}}
 */
function($, stylesheetParser, aceHelper, styleEditor, extension) {
    /**
     * Stößt das Speichern einer neuen Media Query an.
     * @param {string} id - ID des Code Editors, das die Style-Angaben enthält
     */
    var save = function(id){
        var style = aceHelper.getEditorValue(id),
            editorData = aceHelper.getEditorData(id);
        if(style != "" && editorData != undefined) {
            // Speichern und aktuell freigende Media Queries Aktualisieren
            styleEditor.triggerInsertStyle(style, editorData.indexStyleSheet);
            extension.sendMessageToTab({
                type: extension.messageTypes.updateActiveMediaQueries
            });
        }
    };

    /**
     * Initialisiert den Editor zum Hinzufügen einer neuen Media Query.
     * @param {string} id - ID des Code Editors, der Initialisiert werden soll
     */
    var initNewMediaQueryEditor = function(id) {
        aceHelper.initCodeEditor(id, stylesheetParser.getEmptyCssRuleJson(), aceHelper.PERMANENT);
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function(id) {
        initNewMediaQueryEditor(id);
    };

    return {
        init: init,
        save: save
    };
});