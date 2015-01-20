/**
 * Hilfsskript zur Verwendung des Code Editors ACE.
 * Hierpber können Elemente, identidieziert über ihre ID, als Code Editoren initialisiert und deren Inhalt gesetzt
 * werden.
 */
define([
    'ace'
],
function(){
    var editors = [];

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

        saveEditorData(editor, rule.indexStyleSheet, rule.indexRule);
        bindCallbacks(editor);

        return editor;
    };

    var bindCallbacks = function(editor) {
        editor.getSession().selection.on('blur', function(){
            console.log("Blur");
        });
    };

    var saveEditorData = function(editor, indexStyleSheet, indexRule) {
        editors.push({
            editor: editor,
            indexStyleSheet: indexStyleSheet,
            indexRule: indexRule
        });
    };

    return {
        initCodeEditor: initCodeEditor
    }
});
