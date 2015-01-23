/**
 * Dieses Skript kapselt den Zugriff auf Funktionen und Variablen der Hintergrundseite der Erweiterung.
 */
define([
    'extension'
],function(extension){
    var background = extension.getBackgroundPage(); // Hintergrundseite

    var getOuterBrowserSize = function(){
        return {
            width: background.outerBrowserWidth,
            height: background.outerBrowserHeight
        }
    };

    var getInnerBrowserSize = function(){
        return {
            width: background.innerBrowserWidth,
            height: background.innerBrowserHeight
        }
    };

    var getMediaList = function(){
        return background.mediaList;
    };

    return {
        getMediaList: getMediaList,
        getOuterBrowserSize: getOuterBrowserSize,
        getInnerBrowserSize: getInnerBrowserSize
    };
});