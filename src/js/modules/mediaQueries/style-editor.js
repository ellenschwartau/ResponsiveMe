/**
 * Dieses Skript stellt verschiedene Funktionen zum Bearbeiten der Style Sheets bereit,
 * die auf einer Seite geladen werden.
 * Es können vorhandene CSSRegeln gelöscht oder bearbeitet, sowie neue Style-Angaben hinzugefügt werden.
 */
define([
], function(){
    /**
     * Fügt einem Style Sheet (identifiziert über dessen Index) eine neue CSS-Regel
     * am Anfang der Liste der Regeln hinzu.
     * @param {string} style - Style der hinzugefügt werden soll
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var insert = function(style, styleSheetIndex, ruleIndex){
        var styleSheets = document.styleSheets;
        if(styleSheetIndex < styleSheets.length){
            var styleSheet = styleSheets[styleSheetIndex];
            if(ruleIndex >= 0 &&  ruleIndex <= styleSheet.cssRules.length) {
                styleSheet.insertRule(style, ruleIndex);
            }
        }
    };

    /**
     * Löscht eine CSSRegel aus einem Style Sheet.
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var remove = function(styleSheetIndex, ruleIndex){
        var styleSheets = document.styleSheets;
        if(styleSheetIndex < styleSheets.length){
            styleSheets[styleSheetIndex].deleteRule(ruleIndex);
        }
    };

    /**
     * Aktualisiert eine CSSRule.
     * @param {string} style - Style der hinzugefügt werden soll
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var update = function(style, styleSheetIndex, ruleIndex) {
        remove(styleSheetIndex, ruleIndex);
        insert(style, styleSheetIndex, ruleIndex);
    };

    return {
        insert: insert,
        remove: remove,
        update: update
    };

});
