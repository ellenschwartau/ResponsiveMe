/**
 * Hintergrundseite der Erweiterung.
 * Sie läuft durchgehend im Hintergrund und hält Daten und Funktionen zur Kommunikation zwischen
 * den einzelnen Bestandteilen der Erweiterung bereit.
 */
//require([
//    'jquery', 'extension', 'config'
//],function($, extension, config){
//    var outerBrowserHeight, // TODO Initiale Browserbreite hierüber setzen
//        innerBrowserHeight,
//        outerBrowserWidth,
//        innerBrowserWidth,
//        mediaList = ["test 1", "test 2"];
//
//    /**
//     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
//     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
//     */
//    var handleCurrentMediaMessage = function(request){
//        if(request.type === config.messageTypes.displayCurrentMediaList) {
//            mediaList = request.data.mediaList;
//        }
//    };
//
//    extension.handleMessage(handleCurrentMediaMessage);
//
//    return {
//        mediaList: mediaList
//    };
//});

var mediaList = ["test"];