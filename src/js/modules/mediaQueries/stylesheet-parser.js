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
        // TODO hier evtl. schon in JSON Format konvertieren und Index des Stylesheets, sowie der Rule mit speichern
        // um im Nachhinein das bearbeiten zu ermöglichen
        return cssRules;
    };

    /**
     * Liefert alle css-Regeln eines bestimmten Typs.
     * @param type  int Typ der gesuchten Regeln
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
     * Liefert den Wert des Selektors.
     * @param rule  CSSRule
     * @returns String
     */
    var getSelectorValue = function(rule) {
        return "@media " + rule.media.mediaText;
    };

    /**
     * Liefert die Styles einer CSSRule inklusive geschweiften Klammern.
     * @param rule          CSSRule
     * @param selector      String  Selektor
     * @returns {string}
     */
    var getStyleValue = function(rule, selector) {
        var cssText = rule.cssText;
        return cssText.replace(selector, "");
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
     * Formatiert Styleangaben und fügt Absätze ein.
     * @param style
     */
    var formatStyle = function(style) {
        return style
            .replace(/\{/g, "{<br>")
            .replace(/;/g, ";<br>")
            .replace(/\}/g, "}<br>");
    };

    /**
     * Konvertiert die Regeln und die notwendigen Informationen in JSON.
     * @param cssRules  []  CSSRules
     * return {selector: String, style: String}
     */
    var convertRulesToJSON = function(cssRules){
        var jsonRules = [];
        $.each(cssRules, function(i, rule){
            var selector = getSelectorValue(rule),
                style = getStyleValue(rule, selector),
                json = {
                    selector: getSelectorValue(rule),
                    style: formatStyle(style),
                    mediaQueryWidth: getMediaQueryWidth(rule),
                    fullCss: rule.cssText
                };
            jsonRules.push(json);
        });
        return jsonRules;
    };

    /**
     * Liefert die CSS-Rules, die @media-Angaben enthalten.
     */
    var getMediaQueries = function(){
        return convertRulesToJSON(
            getCssRulesWithType(CSS_MEDIA_RULE_TYPE)
        );
    };

    return {
        getMediaQueries: getMediaQueries
    }
});