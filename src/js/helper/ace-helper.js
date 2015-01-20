/**
 * Hilfsskript zur Verwendung des Code Editors ACE.
 * Hierpber können Elemente, identidieziert über ihre ID, als Code Editoren initialisiert und deren Inhalt gesetzt
 * werden.
 */
define([
    'ace'
],
function(){
    var initCodeEditor = function(id, value) {
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
        editor.session.setValue(value);
    };

    return {
        initCodeEditor: initCodeEditor
    }
});
