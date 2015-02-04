define([

],
/**
 * Modul zum Parsen von Media Queries.
 * Liest aus einer Media Query bestimmte Informationen aus und wandelt diese in JSON um.
 * @exports parseMediaQuery
 */
function(){
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
     * Liefert die Breite, ab der eine Media Query greift und geht dabei nur von korrekt verfassten Media Queries aus.
     * Ist mehr als eine Breitenangabe angegeben, wird immer die oberste, also größte Zahl, geliefert.
     * @param {CSSMediaRule} cssMediaRule - Media Query
     * @return {int} - maximale, angegebene Breitenangebe oder -1 wenn keine angegeben wurde
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
        data.mediaQueryWidth = getMediaQueryWidth(rule);
        data.selector = getMediaRuleSelectorValue(rule);
        data.media = rule.media;
    };

    return {
        getMediaList: getMediaList,
        addSpecificInformation: addSpecificInformation
    };
});
