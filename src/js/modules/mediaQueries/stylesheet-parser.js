/**
 * Dieses Skript stellt verschiedene Funktionen zum Parsen von Style Sheets bereit.
 * Die Css-Regeln können beispielsweise nach Media Queries gefiltert und in ein JSON Format umgewandelt werden.
 */
define([
    'jquery'
],
function($){
    // Typ der Media Queries
    var CSS_MEDIA_RULE_TYPE = 4;

    /**
     * Liefert alle css-Regeln eines bestimmten Typs der aktuell geladenen Stylesheets.
     * @returns {Array}
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
     * @param type              int             Typ der Regeln, die geliefert werden sollen
     * @param indexStyleSheet   int             Index des Style Sheets, aus dem die Media Query stammt
     * @param ruleList          CSSRuleList     Liste, die die css-Regeln enthält
     * @returns {Array}
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
     * @param type              int     Typ der Regeln, die geliefert werden sollen
     * @param indexStyleSheet   int         Index des Style Sheets, aus dem die Media Query stammt
     * @param indexRule         int         Index der Regel, die die Media Query definiert
     * @param rule              CSSRegel    Regel
     * @returns {{indexStyleSheet: *, indexRule: *, fullCss: (string|showComposition.$composition.cssText|*|rule.cssText|cssText|.style.cssText), selector: String}}
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
     * @param type      int     Typ der css-Regel
     * @param rule      CSSRule css-Regel
     * @param json      JSON    bisherig gesammelte Daten zur Regel
     */
    var addTypeSpecificInformation = function(type, rule, json) {
        switch(type) {
            case CSS_MEDIA_RULE_TYPE:
                json.mediaQueryWidth = getMediaQueryWidth(rule);
                json.selector = getMediaRuleSelectorValue(rule);
                break;
        }
        return json;
    };

    /**
     * Liefert den Wert des Selektors einer Media Query.
     * @param rule      CSSMediaRule
     * @returns String
     */
    var getMediaRuleSelectorValue = function(rule) {
        return "@media " + rule.media.mediaText;
    };

    /**
     * Liefert die Breite, ab der eine Media Query greift und geht dabei nur von korrekt verfassten Media Queries aus.
     * Ist mehr als eine Breitenangabe angegeben, wird immer die oberste, also größte Zahl, geliefert.
     * @param cssMediaRule  CSSMediaRule    Media Query
     * @return int  maximale, angegebene Breitenangebe oder -1 wenn keine angegeben wurde
     */
    var getMediaQueryWidth = function(cssMediaRule) {
        var mediaList = cssMediaRule.media,
            PREFIX = "width: ",
            POSTFIX = "px",
            width = -1;
        // Elemente müssen so abgelaufen werden, da die MediaList neben der Liste noch weitere Attribute enthält
        for(var i=0; i<mediaList.length; i++) {
            var mediaRule = mediaList[i],
                widthIndex = mediaRule.indexOf(PREFIX);
            while(widthIndex > -1) {
                var endPrefix = widthIndex + PREFIX.length,
                    unit = mediaRule.indexOf(POSTFIX, endPrefix),
                    widthBegin = endPrefix,
                    widthEnd = unit - 1;
                if(unit > -1 && (widthEnd > widthBegin)) {
                    // Wenn der Postfix gefunden wurde und zwischen Pre- und Postfix noch etwas steht,
                    // diesen Wert auslesen und als width übernehmen, wenn er größer als die bisherige Angabe ist
                    width = Math.max(
                        width,
                        parseFloat(
                            mediaRule.substr(widthBegin, widthEnd)
                        )
                    );
                }
                // Nach weiteren Breitenangaben suchen
                widthIndex = mediaRule.indexOf(PREFIX, endPrefix);
            }
        }
        return width;
    };

    /**
     * Liefert die CSS-Rules, die @media-Angaben enthalten.
     */
    var getMediaQueries = function(){
        return getCssRules(CSS_MEDIA_RULE_TYPE);
    };

    return {
        getMediaQueries: getMediaQueries
    }
});