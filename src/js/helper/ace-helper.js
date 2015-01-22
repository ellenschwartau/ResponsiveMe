/**
 * Hilfsskript zur Verwendung des Code Editors ACE.
 * Hierüber können Elemente, identidieziert über ihre ID, als Code Editoren initialisiert und deren Inhalt gesetzt
 * werden.
 * Alle vorhandenen Editoren werden in diesem Modul zwischengespeichert, um später auf sie zugreifen zu können.
 */
define([
    'jquery'
],
function($){
    var editors = [];

    /**
     * Initialisiert einen Code Editor zur Anzeige und Bearbeitung von CSS-Angaben.
     * @param {string} id - CSS-ID des Editors
     * @param {{styleSheetIndex:int,ruleIndex:int,fullCss:string}} rule - Daten der Regel, die angezeigt werden soll
     * @returns {Object} - Editor
     */
    var initCodeEditor = function(id, rule) {
        // Editor Erstellen und Modus sowie Theme setzen
        var editor = ace.edit(id);
        editor.session.setMode("ace/mode/css");
        editor.setTheme("ace/theme/dawn");

        // Umbrüche erzwingen
        editor.session.setUseWrapMode(true);
        // Keine Warnmeldung wenn kein Cursor gesetzt wurde
        editor.$blockScrolling = Infinity;
        // Zeilenzahlen
        editor.renderer.setShowGutter(false);
        // Wert des Editors initialisieren
        editor.session.setValue(rule.fullCss);
        // Auto-Vervollständigung
        enableAutocompletion(editor);

        // Editor und wichtige Daten zum späteren Zugriff zwischenspeichern
        saveEditorData(editor, id, rule.indexStyleSheet, rule.indexRule);
        // Callbacks initialisieren
        bindCallbacks(editor);

        return editor;
    };

    /**
     * Aktiviert die Autovervollständigung des Editors.
     * @param {Object} editor - Code Editor
     */
    var enableAutocompletion = function(editor){
        ace.require("ace/ext/language_tools");
        editor.setOptions({
            enableBasicAutocompletion: true,
            enableLiveAutocompletion: true
        });
    };

    // TODO
    var bindCallbacks = function(editor) {
        editor.getSession().selection.on('blur', function(){
            console.log("Blur");
        });
    };

    /**
     * Speichert die Daten eines Editors zwischen.
     * @param {Object} editor - Code Editor
     * @param {string} id - CSS-ID des Editors
     * @param {int} indexStyleSheet - Index des Style Sheets, zu dem der Inhalt des Editors gehört
     * @param {int} indexRule - Index der Regel, zu der der Inhalt des Editors gehört
     */
    var saveEditorData = function(editor, id, indexStyleSheet, indexRule) {
        editors.push({
            editor: editor,
            id: id,
            indexStyleSheet: indexStyleSheet,
            indexRule: indexRule
        });
    };

    /**
     * Liefert den aktuellen Inhalt eines Editors, spezifiziert über dessen id.
     * @param {string} id - CSS-ID des Editors
     * @returns {string}
     */
    var getEditorValue = function(id) {
        var editorData = getEditorData(id);
        return editorData != undefined ? editorData.editor.session.getValue() : "";
    };

    /**
     * Leert den Inhalt eines über seine ID bestimmten Editors.
     * @param {string} id - CSS-ID des Editors
     */
    var clearEditorValue = function(id){
        var editorData = getEditorData(id);
        if(editorData != undefined) {
            editorData.session.setValue("");
        }
    };

    /**
     * Liefert die Daten eines Editors, der über seine ID spezifiziert wird.
     * @param {String} id - css-ID des Editors
     * @returns {undefined|{editor:Object,id:string,indexStyleSheets:int,indexRule:int}}
     */
    var getEditorData = function(id) {
        var data = undefined;
        $.each(editors, function(i, editorData){
            if(editorData.id === id) {
                data = editorData;
            }
        });
        return data;
    };

    return {
        initCodeEditor: initCodeEditor,
        getEditorValue: getEditorValue,
        cleatEditorValue: clearEditorValue,
        getEditorData: getEditorData
    }
});
