define([
    'jquery', 'tools', 'mediaQueryParser'
],
/**
 * Dieses Skript stellt verschiedene Funktionen zum Parsen von Style Sheets bereit.
 * Die Css-Regeln können beispielsweise nach Media Queries gefiltert und in ein JSON Format umgewandelt werden.
 * @exports stylesheetParser
 * @param {Object} $ - JQuery
 * @param {module} tools - tools-Module
 * @see module:tools
 * @param {module} mediaQueryParser - mediaQueryParser-Modul
 * @see modules:mediaQueryParser
 * @returns {{getMediaQueries: Function, getEmptyCssRuleJson: Function, getMediaList: Function}}
 */
function($, tools, mediaQueryParser){
    /**
     * Kennzahl der CSSRules des Typs Media Query
     * @type {number}
     */
    var CSS_MEDIA_RULE_TYPE = 4;

    // {{styleSheetIndex:int,ruleIndex:int,fullCss:string}[]}
    // TODO

    /**
     * Liefert alle css-Regeln eines bestimmten Typs der aktuell geladenen Stylesheets.
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
     * List aus einer Liste an CSSRules die einzelnen Regeln aus und konvertiert die
     * benötigten Informationen ins JSON-Format.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @param {int} indexStyleSheet - Index des Style Sheets, aus dem die Media Query stammt
     * @param {CSSRuleList} ruleList - Liste, die die css-Regeln enthält
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
     * Konvertiert eine Media Query in ein JSON-Format.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @param {int} indexStyleSheet - Index des Style Sheets, aus dem die Media Query stammt
     * @param {int} indexRule - Index der Regel, die die Media Query definiert
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
     * Fügt dem JSON Object der css-Regel je nach dessen Typ weitere Daten an.
     * @param {int} type - Typ der Regeln, die ausgelesen werden sollen
     * @param {CSSRule} rule - CSS-Regel
     * @param {json} json  - bisherig gesammelte Daten zur Regel
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
     * Liefert die Liste an Media-Angaben, die in den Media Queries enthalten sind.
     * @returns {Array} Liste der Media-Angaben
     */
    var getMediaList = function(){
        return mediaQueryParser.getMediaList(getMediaQueries());
    };

    /**
     * Liefert die CSS-Rules, die @media-Angaben enthalten.
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