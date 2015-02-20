define([
    'jquery', 'tools'
],
/**
 * Modul zum Parsen von Media Queries. Dient dem Auslesen aller vorhandenen Media Queries sowie dem Umwandeln
 * von Media Queries in JSON.
 * @exports parseMediaQuery
 * @param {Object} $ - JQuery
 * @param {module} tools - tools-Modul
 * @see module:tools
 * @returns {{getMediaList: Function, addSpecificInformation: Function}}
 */
function($, tools){
    var WIDTH_PROPERTY_PREFIX = "width: ",              // String zur Angabe einer Breite
        MIN_PROPERTY_POSTFIX = ["min-", "min-device-"], // String zur Angaben einer minimalen Breite
        WIDTH_PROPERTY_POSTFIX = "px";                  // String zur Angabe einer Pixel-Größe
    /**
     * Liefert die einzigartigen Vorkommen an Media Queries aus der übergebenen Liste.
     * @param {json} mediaQueries - Liste der Media Queries in JSO-Notation
     * @returns {Array} Menge der Media-Angaben
     */
    var getMediaList = function(mediaQueries){
        var resultList = [];
        $.each(mediaQueries, function(index, mediaQuery) {
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
     * Fügt den bisherigen Daten der Media Query zwei Breitenangaben hinzu:
     * data.mediaQueryWidth: größte Breitenangabe, ab der die Media Query greift
     * data.mediaQueryToggleWidth: Breitenangabe, ab der die Media Query gerade nicht greift
     * @param {json} data  - bisherig gesammelte Daten zur Regel
     * @param {MediaList} mediaList - Liste der Media Angaben in einer Media Query
     */
    var addMediaQueryWidthAttributes = function(data, mediaList) {
        /**
         * Ermittelt die maximale Breitenangabe innerhalb der Media Query.
         * @param {json} data  - bisherig gesammelte Daten zur Regel
         * @param {CSSMediaRule} mediaRule - Media Query
         * @param {int} widthIndex - erstes Vorkommen einer Breitenangabe
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
                    // diesen Wert auslesen und als width übernehmen, wenn er größer als die bisher gefundene Angabe ist
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
         * Das ist notwendig, um die richtigr Breite zum togglen der Media Query anzubieten.
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
         * Berechnet die Breite bei der eine gerade nicht greift Media Query deaktiviert wird.
         * Bei einer min-Breitenangabe wird diese um einen Pixel unterschritten,
         * exakte oder max-Breitenangaben werden um einen Pixel überschritten.
         * @param {CSSMediaRule} mediaRule - Media Query
         * @param {int} widthIndex - Vorkommen der Breitenangabe
         * @param {int} width - px-Wert der Breitenangabe
         * @returns {number}
         */
        var getToggleWidth = function(mediaRule, widthIndex, width){
            if(isMinWidthProperty(mediaRule, widthIndex)){
                // Minimale Angabe - um die Media Query zu deaktivieren muss diese unterschritten werden
                return Math.max(0, --width);
            } else {
                // maximale oder exakte Breitenangabe - um die Media Query zu deaktivieren muss/kann diese überschritten werden
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
     * Liefert den Selektor einer Media Query inklusive @media-Angabe.
     * @param {CSSMediaRule} rule - Media Query
     * @returns {string}
     */
    var getMediaRuleSelectorValue = function(rule) {
        return "@media " + rule.media.mediaText;
    };

    /**
     * Fügt dem JSON-Object der CSS-Regel Media Query spezifische Daten an.
     * @param {json} data  - bisheR gesammelte Daten zur Regel
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
