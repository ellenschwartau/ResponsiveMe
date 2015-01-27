define([
    'jquery', 'extension', 'config'
],
/**
 * Hintergrundseite der Erweiterung.
 * Sie läuft durchgehend im Hintergrund und hält Daten und Funktionen zur Kommunikation zwischen
 * den einzelnen Bestandteilen der Erweiterung bereit.
 * @exports background
 * @param {Object} $ - JQuery
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 * @returns {{mediaList: string[]}}
 */
function($, extension, config){
    var outerBrowserHeight, // TODO Initiale Browserbreite hierüber setzen
        innerBrowserHeight,
        outerBrowserWidth,
        innerBrowserWidth,
        mediaList = ["test 1", "test 2"];

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        if(request.type === config.messageTypes.displayCurrentMediaList) {
            mediaList = request.data.mediaList;
        }
    };

    extension.handleMessage(handleCurrentMediaMessage);

    return {
        mediaList: mediaList
    };
});

var mediaList = ["test"];