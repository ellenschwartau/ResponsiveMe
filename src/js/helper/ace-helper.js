/**
 * Hilfsskript zur Verwendung des Code Editors ACE.
 * Hierüber können Elemente, identidieziert über ihre ID, als Code Editoren initialisiert und deren Inhalt gesetzt
 * werden.
 * Alle vorhandenen Editoren werden in diesem Modul zwischengespeichert, um später auf sie zugreifen zu können.
 */
define([
    'ace'
],
function(){
    var editors = [];

    /**
     * Initialisiert einen Code Editor zur Anzeige und Bearbeitung von CSS-Angaben.
     * @param id        int     ID des Editors
     * @param rule      CSSRule Regel, die angezeigt werden soll
     * @returns {*}     Editor
     */
    var initCodeEditor = function(id, rule) {
        // trigger extension
        ace.require("ace/ext/language_tools");
        var editor = ace.edit(id);
        editor.session.setMode("ace/mode/css");
        editor.setTheme("ace/theme/dawn");
        // enable autocompletion and snippets
        editor.setOptions({
            enableBasicAutocompletion: true
        });
        editor.renderer.setShowGutter(false);
        editor.session.setValue(rule.fullCss);

        saveEditorData(editor, id, rule.indexStyleSheet, rule.indexRule);
        bindCallbacks(editor);

        return editor;
    };

    // TODO
    var bindCallbacks = function(editor) {
        editor.getSession().selection.on('blur', function(){
            console.log("Blur");
        });
    };

    /**
     * Speichert die Daten eines Editors zwischen.
     * @param editor            Object  Code Editor
     * @param id                String  ID des Editors
     * @param indexStyleSheet   int     Index des Style Sheets, zu dem der Inhalt des Editors gehört
     * @param indexRule         int     Index der Regel, zu der der Inhalt des Editors gehört
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
     * @param id            String      ID des Editors
     * @returns {string}
     */
    var getEditorValue = function(id) {
        $.each(editors, function(i, editor){
            if(editor.id === id) {
                return editor.session.getValue();
            }
        });
        return "";
    };

    return {
        initCodeEditor: initCodeEditor,
        getEditorValue: getEditorValue
    }
});
