/**
 * Dieses Skript stellt verschiedene Funktionen zum Bearbeiten der Style Sheets bereit,
 * die auf einer Seite geladen werden.
 * Es können vorhandene CSSRegeln gelöscht oder bearbeitet, sowie neue Style-Angaben hinzugefügt werden.
 */
define([
    'config', 'extension'
], function(config, extension){
    /**
     * Fügt einem Style Sheet (identifiziert über dessen Index) eine neue CSS-Regel
     * am Anfang der Liste der Regeln hinzu, wenn die Style-Angaben nicht leer sind.
     * @param {string} style - Style der hinzugefügt werden soll
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var insert = function(style, styleSheetIndex, ruleIndex){
        if(style != ""){
            var styleSheets = document.styleSheets;
            if(styleSheetIndex < styleSheets.length){
                var styleSheet = styleSheets[styleSheetIndex];
                if(ruleIndex >= 0 &&  ruleIndex <= styleSheet.cssRules.length) {
                    styleSheet.insertRule(style, ruleIndex);
                }
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
     * Aktualisiert eine CSSRule. Ist die neue Style-Angabe leer, wird die CSS-Regel gelöscht.
     * @param {string} style - Style der hinzugefügt werden soll
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var update = function(style, styleSheetIndex, ruleIndex) {
        remove(styleSheetIndex, ruleIndex);
        insert(style, styleSheetIndex, ruleIndex);
    };

    /**
     * Triggert das Speichern eines neuen Styles in ein bestimmtes Style Sheet.
     * @param {string} style - css Style
     * @param {int} indexStyleSheet - Index des Style Sheets aus der Liste der geladenen Style Sheets
     */
    var triggerInsertStyle = function(style, indexStyleSheet) {
        extension.sendMessageToTab({
            type: config.messageTypes.insertStyle,
            data: {
                style: style,
                indexStyleSheet: indexStyleSheet
            }
        });
    };

    /**
     * Triggert die Aktualisierung eines Styles in ein bestimmtes Style Sheet.
     * @param {string} style - css Style
     * @param {int} indexStyleSheet - Index des Style Sheets aus der Liste der geladenen Style Sheets
     * @param {int} indexRule - Index der CSSRule aus der Liste der Regeln eines bestimmten Style Sheets
     */
    var triggerUpdateStyle = function(style, indexStyleSheet, indexRule) {
        extension.sendMessageToTab({
            type: config.messageTypes.updateStyle,
            data: {
                style: style,
                indexStyleSheet: indexStyleSheet,
                indexRule: indexRule
            }
        });
    };

    /**
     * Triggert das Löschen eines Styles aus einem bestimmten Style Sheet.
     * @param {int} indexStyleSheet - Index des Style Sheets aus der Liste der geladenen Style Sheets
     */
    var triggerDeleteStyle = function(indexStyleSheet) {
        extension.sendMessageToTab({
            type: config.messageTypes.deleteStyle,
            data: {
                indexStyleSheet: indexStyleSheet
            }
        });
    };

    return {
        insert: insert,
        remove: remove,
        update: update,
        triggerInsertStyle: triggerInsertStyle,
        triggerUpdateStyle: triggerUpdateStyle,
        triggerDeleteStyle: triggerDeleteStyle
    };

});
