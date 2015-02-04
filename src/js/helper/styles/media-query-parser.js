define([
    'jquery', 'tools'
],
/**
 * Modul zum Parsen von Media Queries.
 * Liest aus einer Media Query bestimmte Informationen aus und wandelt diese in JSON um.
 * @exports parseMediaQuery
 */
function($, tools){
    var WIDTH_PROPERTY_PREFIX = "width: ",
        MIN_PROPERTY_POSTFIX = ["min-", "min-device-"],
        WIDTH_PROPERTY_POSTFIX = "px";
    /**
     * Liefert die Liste an Media-Angaben, die in den Media Queries enthalten sind.
     * @param {json} mediaQueries - Liste der Media Queries in JSO-Notation
     * @returns {Array} Liste der Media-Angaben
     */
    var getMediaList = function(mediaQueries){
        var resultList = [];
        $.each(mediaQueries, function(i, mediaQuery) {
            var mediaList = mediaQuery.media;
            for(var i=0; i<mediaList.length; i++) {
                var media = mediaList[i];
                if (!tools.list.listContainsValue(resultList, media)) {
                    resultList.push(media);
                }
            }
        });
        return resultList;
    };

    /**
     * Fügt den bisherigen Daten der Media Query zwei Breitenangaben an:
     * data.mediaQueryWidth: größte Breitenangabe, ab der die Media Query greift
     * data.mediaQueryToggleWidth: Breitenangabe, ab der die Media Query gerade nicht greift
     * @param {json} data  - bisherig gesammelte Daten zur Regel
     * @param {MediaList} mediaList - Liste der Media Angaben in einer Media Query
     * // TODO TEST
     */
    var addMediaQueryWidthAttributes = function(data, mediaList) {
        /**
         * Ermittelt die maximale Breitenangabe innerhalb der Media Query.
         * @param {json} data  - bisherig gesammelte Daten zur Regel
         * @param {CSSMediaRule} mediaRule - Media Query
         * @param {int} widthIndex - Erstes Vorkommen einer Breitenangabe
         */
        var addWidthProperties = function(data, mediaRule, widthIndex){
            var width = -1;
            while(widthIndex > -1) {
                var endPrefix = widthIndex + WIDTH_PROPERTY_PREFIX.length,
                    unit = mediaRule.indexOf(WIDTH_PROPERTY_POSTFIX, endPrefix),
                    widthBegin = endPrefix,
                    widthEnd = unit - 1;
                if(unit > -1 && (widthEnd > widthBegin)) {
                    // Wenn der Postfix gefunden wurde und zwischen Pre- und Postfix noch etwas steht,
                    // diesen Wert auslesen und als width übernehmen, wenn er größer als die bisherige Angabe ist
                    var newWidth = parseFloat(mediaRule.substr(widthBegin, widthEnd));
                    if(newWidth > width){
                        width = newWidth;
                        data.widthProperties.push({
                            active: width,
                            inactive: getToggleWidth(mediaRule, widthIndex, width)
                        });
                    }
                }
                // Nach weiteren Breitenangaben suchen
                widthIndex = mediaRule.indexOf(WIDTH_PROPERTY_PREFIX, endPrefix);
            }
        };

        /**
         * Prüft, ob die vorhandene Breiten-Angabe eine minimale Breite spezifiziert
         * (also z.B. durch min-width: ... oder min-device-width: ...).
         * Das ist notwendig, um die Breite zum togglen der Media Query anzubieten.
         * Enthält die Media Query beispielsweise die Breitenangabe 500px, wird bei einer minimalen Angabe die
         * Breite 499px, bei allen anderen die Breite 501px zum deaktivieren der Media Query berechnet.
         * @param {CSSMediaRule} mediaRule - Media Query
         * @param {int} widthIndex - Vorkommen der Breitenangabe
         */
        var isMinWidthProperty = function(mediaRule, widthIndex){
            var isMinWidthProperty = false;
            $.each(MIN_PROPERTY_POSTFIX, function(i, MIN_PROPERTY){
                if(!isMinWidthProperty){
                    var postfixLength = MIN_PROPERTY.length,
                        startCheck = widthIndex - postfixLength;
                    if(startCheck > 0) {
                        isMinWidthProperty = MIN_PROPERTY === mediaRule.substr(startCheck, postfixLength);
                    }
                }
            });
            return isMinWidthProperty;
        };

        /**
         * Berechnet die Breite bei der eine Media Query deaktiviert wird, also um einen Pixel nicht greift.
         * Bei einer min-Breitenangabe wird diese um einen Pixel unterschritten,
         * exakte oder max-Breitenangaben werden um einen Pixel überschritten.
         * @param {CSSMediaRule} mediaRule - Media Query
         * @param {int} widthIndex - Vorkommen der Breitenangabe
         * @param {int} width - px-Wert der Breitenangabe
         * @returns {number}
         */
        var getToggleWidth = function(mediaRule, widthIndex, width){
            if(isMinWidthProperty(mediaRule, widthIndex)){
                // Minimale Angabe
                // - um die Media Query zu deaktivieren muss diese unterschritten werden
                return Math.max(0, --width);
            } else {
                // maximale oder exakte Breitenangabe
                // - um die Media Query zu deaktivieren muss/kann diese überschritten werden
                return ++width;
            }
        };

        // Liste initialisieren
        data.widthProperties = [];
        // Elemente müssen so abgelaufen werden, da die MediaList neben der Liste noch weitere Attribute enthält
        for(var i=0; i<mediaList.length; i++) {
            var mediaRule = mediaList[i],
                widthIndex = mediaRule.indexOf(WIDTH_PROPERTY_PREFIX);
            addWidthProperties(data, mediaRule, widthIndex);
        }
    };

    /**
     * Liefert den Wert des Selektors einer Media Query.
     * @param {CSSMediaRule} rule - Media Query
     * @returns {string}
     */
    var getMediaRuleSelectorValue = function(rule) {
        return "@media " + rule.media.mediaText;
    };

    /**
     * Fügt dem JSON Object der css-Regel weitere Media Query spezifische Daten an.
     * @param {json} data  - bisherig gesammelte Daten zur Regel
     * @param {CSSRule} rule - CSS-Regel
     * @return {{indexStyleSheet:int, indexRule:int, fullCss:string, selector:string, mediaQueryWidth:int,selector:string}}
     */
    var addSpecificInformation = function(data, rule){
        addMediaQueryWidthAttributes(data, rule.media);
        data.selector = getMediaRuleSelectorValue(rule);
        data.media = rule.media;
    };

    return {
        getMediaList: getMediaList,
        addSpecificInformation: addSpecificInformation
    };
});
