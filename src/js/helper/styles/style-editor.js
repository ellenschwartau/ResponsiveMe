define([
    'extension'
],
/**
 * Dieses Skript stellt verschiedene Funktionen zum Bearbeiten der Style Sheets bereit,
 * die auf einer Seite geladen werden.
 * Es können vorhandene CSSRegeln gelöscht oder bearbeitet, sowie neue Style-Angaben hinzugefügt werden.
 * @exports styleEditor
 * @param {module} extension - extensionModul
 * @see module:extension
 * @returns {{insert: Function, remove: Function, update: Function, triggerInsertStyle: Function, triggerUpdateStyle: Function, triggerDeleteStyle: Function}}
 */
function(extension){
    /**
     * Prüft, ob ein angefordertes Style Sheet vorhanden ist.
     * @param {StyleSheetList} styleSheets - Liste vorhandener Style Sheets
     * @param {int} styleSheetIndex - Index des auszulesenden Style Sheets
     * @returns {boolean}
     */
    var styleSheetIsValid = function(styleSheets, styleSheetIndex){
        return styleSheetIndex < styleSheets.length && styleSheets[styleSheetIndex] != null;
    };

    /**
     * Prüft, ob eine CSS Regel an einer bestimmten Stelle in eine bestehende Liste eingefügt werden kann.
     * Das ist der Fall, wenn diese Liste leer ist, oder die neue Regel innerhalb oder am Ende der Liste
     * eingefügt werden soll.
     * @param {CSSRuleList} cssRules - Liste bestehender Regeln
     * @param {int} newRuleIndex - Index der Stelle, an der die neue Regel eingefügt werden soll
     * @returns {boolean}
     */
    var ruleCanBeInserted = function(cssRules, newRuleIndex){
        return cssRules != null && newRuleIndex >= 0 && newRuleIndex <= cssRules.length;
    };

    /**
     * Fügt ein neues Style Sheet mit den übergebenen Style Angaben hinzu.
     * @param {String} style - CSS
     */
    var addNewStyleSheet = function(style){
        // Create the <style> tag
        var styleElm = document.createElement("style");
        $(styleElm).html(style);
        document.head.appendChild(styleElm);
    };

    /**
     * Fügt einem Style Sheet (identifiziert über dessen Index) eine neue CSS-Regel
     * hinzu, wenn die Style-Angaben nicht leer sind. Sollte das Einfügen an der definierten
     * Stelle nicht möglich sein, weil das Style Sheet nicht existiert oder die gewünschte Stelle
     * in der Liste der CSS Regeln nicht valide ist, dann wird ein neues Style Sheet erstellt.
     * @param {string} style - Style der hinzugefügt werden soll
     * @param {int} styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     */
    var insert = function(style, styleSheetIndex, ruleIndex){
        if(style != ""){
            var styleSheets = document.styleSheets,
                insertionPossible = false;
            if(styleSheetIsValid(styleSheets, styleSheetIndex)) {
                var styleSheet = styleSheets[styleSheetIndex];
                insertionPossible = ruleCanBeInserted(styleSheet.cssRules, ruleIndex);
                if(insertionPossible) {
                    styleSheet.insertRule(style, ruleIndex);
                }
            }
            if(!insertionPossible){
                addNewStyleSheet(style);
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
            type: extension.messageTypes.insertStyle,
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
            type: extension.messageTypes.updateStyle,
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
            type: extension.messageTypes.deleteStyle,
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
