/**
 * Modul zum Erstellen und speichern einer neuen Media Query.
 * Dieses Skript stellt Funktionen bereit, einen Code Editor zu initialisieren und dessen Inhalt
 * als eine neue Style-Angabe zu speichern.
 * @module newMediaQuery
 */
define([
    'jquery', 'stylesheetParser', 'codeEditorHelper', 'styleEditor'
],
function($, stylesheetParser, aceHelper, styleEditor) {
    /**
     * Stößt das Speichern einer neuen Media Query an.
     * @param {string} id - ID des Code Editors, das die Style-Angaben enthält
     */
    var save = function(id){
        var style = aceHelper.getEditorValue(id),
            editorData = aceHelper.getEditorData(id);
        if(style != "" && editorData != undefined) {
            styleEditor.triggerInsertStyle(style, editorData.indexStyleSheet);
        }
    };

    /**
     * Initialisiert den Editor zum Hinzufügen einer neuen Media Query.
     * @param {string} id - ID des Code Editors, der Initialisiert werden soll
     */
    var initNewMediaQueryEditor = function(id) {
        aceHelper.initCodeEditor(id, stylesheetParser.getEmptyCssRuleJson());
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