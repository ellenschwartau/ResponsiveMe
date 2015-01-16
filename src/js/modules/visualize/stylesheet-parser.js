/**
 * Dieses Skript stellt verschiedene Funktionen zum Parsen von Style Sheets bereit.
 * Die Css-Regeln können beispielsweise nach Media Queries oder beliebigen anderen Selektoren gefiltert werden.
 *
 * // TODO hier: http://stackoverflow.com/questions/15696124/accessing-css-media-query-rules-via-javascript-dom
 */
define([
    'jquery'
],
function($){
    var CSS_STYLE_RULE_TYPE = 1,
        CSS_MEDIA_RULE_TYPE = 4,
        CSS_STYLE_RULE_ATTRIBUTE_SELECTOR = "selectorText",
        CSS_STYLE_RULE_ATTRIBUTE_CSS_TEXT = "cssText";
    /**
     * Liefert alle css-Regeln der aktuell geladenen Stylesheets.
     * @returns {Array}
     */
    var getCssRules = function() {
        var styleSheets = document.styleSheets,
            cssRules = [];
        $.each(styleSheets, function(i, styleSheet){
            var ruleLists = styleSheet.cssRules;
            if(ruleLists != null && ruleLists.length > 0) {
                $.each(ruleLists, function(i, rules){
                    cssRules.push(rules);
                });
            }
        });
        return cssRules;
    };

    /**
     * Liefert alle css-Regeln eines bestimmten Typs.
     * @param type  int Typ der gesuchten Regeln
     *                  1: Style Rule
     *                  4: Media Rule
     */
    var getCssRulesWithType = function(type) {
        var cssRules = getCssRules(),
            filteredRules = [];
        $.each(cssRules, function(i, cssRule) {
            if(cssRule.type == type) {
                filteredRules.push(cssRule);
            }
        });
        return filteredRules;
    };

    /**
     * Filtert aus css-Regeln eines bestimmten Typs diejenigen heraus,
     * deren definiertes Attribut einen bestimmten Wert enthält.
     * @param type              Typ der Css-Regeln, die durchsucht werden sollen
     * @param attribute         Attribut, das einen bestimmten Wert enthalten soll
     * @param shouldContain     Wert, der im Attribut enthalten sein soll
     * @returns {Array}
     */
    var filterCssRule = function(type, attribute, shouldContain) {
        var cssRules = getCssRulesWithType(type),
            filteredRules = [];
        $.each(cssRules, function(i, cssRule){
            var value = cssRule[attribute];
            if(value !== undefined) {
                if(value.indexOf(shouldContain) > -1) {
                    filteredRules.push(cssRule);
                }
            }
        });
        return filteredRules;
    };

    /**
     * Filtert aus allen Styleangaben die css-Rules heraus, die den übergebenen Selektor enthalten.
     * @param filterSelector    String  Selektor, nach dem gefiltert werden soll
     */
    var getCssStyleRuleContainingSelector = function(filterSelector){
        return filterCssRule(CSS_STYLE_RULE_TYPE, CSS_STYLE_RULE_ATTRIBUTE_SELECTOR, filterSelector);
    };

    /**
     * Filtert auf allen Styleangaben, die css-Rules heraus, die den übergeben String beinhalten.
     * @param filter   String  Style, nach dem gefiltert werden soll
     */
    var getCssStyleRuleContaining = function(filter) {
        return filterCssRule(CSS_STYLE_RULE_TYPE, CSS_STYLE_RULE_ATTRIBUTE_CSS_TEXT, filter);
    };

    /**
     * Liefert die CSS-Rules, die @media-Angaben enthalten.
     */
    var getMediaQueries = function(){
        return getCssRulesWithType(CSS_MEDIA_RULE_TYPE);
    };

    return {
        getMediaQueries: getMediaQueries,
        getCssStyleRuleContainingSelector: getCssStyleRuleContainingSelector,
        getCssStyleRuleContaining: getCssStyleRuleContaining
    }
});