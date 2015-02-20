define([
    'jquery', 'mediaQueryParser'
],
/**
 * Dieses Skript stellt verschiedene Funktionen zum Parsen von Style Sheets bereit.
 * Die CSS-Regeln können beispielsweise nach Media Queries gefiltert und in ein JSON Format umgewandelt werden.
 * @exports stylesheetParser
 * @param {Object} $ - JQuery
 * @param {module} mediaQueryParser - mediaQueryParser-Modul
 * @see module:mediaQueryParser
 * @returns {{getMediaQueries: Function, getEmptyCssRuleJson: Function, getMediaList: Function}}
 */
function($, mediaQueryParser){
    /**
     * Kennzahl der CSSRules des Typs Media Query
     * @type {number}
     */
    var CSS_MEDIA_RULE_TYPE = 4;

    /**
     * Liefert alle CSS-Regeln eines bestimmten Typs der aktuell geladenen Style Sheets.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @returns {json}
     */
    var getCssRules = function(type) {
        var styleSheets = document.styleSheets,
            cssRules = [];

        // StyleSheets durchlaufen
        $.each(styleSheets, function(indexStyleSheet, styleSheet){
            var ruleList = styleSheet.cssRules;
            if(ruleList != null && ruleList.length > 0) {
                // Für jedes StyleSheet die Liste an Regeln in JSON konvertieren
                var rules = getCssRulesFromRuleList(type, indexStyleSheet, ruleList);
                // Und die Regeln in eine Liste speichern
                $.each(rules, function(i, rule){
                    cssRules.push(rule);
                });
            }
        });

        return cssRules;
    };

    /**
     * Liest aus einer Liste an CSSRules die Regeln eines Typs aus und konvertiert die
     * benötigten Informationen ins JSON-Format.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @param {int} indexStyleSheet - Index des Style Sheets, aus dem die Regel stammt
     * @param {CSSRuleList} ruleList - Liste, die die CSS-Regeln enthält
     * @returns {json}
     */
    var getCssRulesFromRuleList = function(type, indexStyleSheet, ruleList) {
        var cssRules = [];
        $.each(ruleList, function(indexRule, rule){
            if(rule.type == type) {
                // Jede Rule des Typs in JSON mit den benötigten Informationen speichern
                cssRules.push(convertRuleToJson(type, indexStyleSheet, indexRule, rule));
            }
        });
        return cssRules;
    };

    /**
     * Konvertiert eine CSS-Regel ins JSON-Format.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @param {int} indexStyleSheet - Index des Style Sheets, aus dem die Media Query stammt
     * @param {int} indexRule - Index der Regel, aus der Liste der CSS-Regeln des Style Sheets
     * @param {CSSRule} rule - CSS-Regel
     * @returns {{indexStyleSheet:int, indexRule:int, fullCss:string, selector:string}}
     */
    var convertRuleToJson = function(type, indexStyleSheet, indexRule, rule) {
        return addTypeSpecificInformation(type, rule, {
            indexStyleSheet: indexStyleSheet,
            indexRule: indexRule,
            fullCss: rule.cssText
        });
    };

    /**
     * Fügt dem JSON Object der CSS-Regel je nach dessen Typ weitere Daten an.
     * @param {int} type - Typ der Regeln
     * @param {CSSRule} rule - CSS-Regel
     * @param {json} json  - bisher gesammelte Daten zur Regel
     * @return {{indexStyleSheet:int, indexRule:int, fullCss:string, selector:string, mediaQueryWidth:int,selector:string}}
     */
    var addTypeSpecificInformation = function(type, rule, json) {
        switch(type) {
            case CSS_MEDIA_RULE_TYPE:
                mediaQueryParser.addSpecificInformation(json, rule);
                break;
        }
        return json;
    };

    /**
     * Liefert ein leeres Object einer CSSRule im JSON Format.
     * @returns {{indexStyleSheet: number, indexRule: number, fullCss: string}}
     */
    var getEmptyCssRuleJson = function() {
        return {
            indexStyleSheet: 0,
            indexRule: 0,
            fullCss: ""
        };
    };

    /**
     * Liefert die Liste an Media Queries, die in Style Sheets enthalten sind.
     * @returns {string[]} Liste der Media-Angaben
     */
    var getMediaList = function(){
        return mediaQueryParser.getMediaList(getMediaQueries());
    };

    /**
     * Liefert die Media Queries der geladenen Website.
     * @return {Array}
     */
    var getMediaQueries = function(){
        return getCssRules(CSS_MEDIA_RULE_TYPE);
    };

    return {
        getMediaQueries: getMediaQueries,
        getEmptyCssRuleJson: getEmptyCssRuleJson,
        getMediaList: getMediaList
    }
});