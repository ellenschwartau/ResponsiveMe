require([
    'jquery', 'matchMedia', 'extension', 'config'
],
/**
 * Hintergrundseite der Erweiterung.
 * Sie läuft durchgehend im Hintergrund und hält Daten und Funktionen zur Kommunikation zwischen
 * den einzelnen Bestandteilen der Erweiterung bereit.
 * @exports background
 * @param {Object} $ - JQuery
 * @param {module} matchMedia - matchMedia-Modul
 * @see module:matchMedia
 * @param {module} extension - extension-Modul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 * @returns {{mediaList: string[]}}
 */
function($, matchMedia, extension, config){
    var outerBrowserHeight, // TODO Initiale Browserbreite hierüber setzen
        innerBrowserHeight,
        outerBrowserWidth,
        innerBrowserWidth,
        mediaList;

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        if(request.type === config.messageTypes.displayCurrentMediaList) {
            mediaList = request.data.mediaList;
        }
        exportValuesToBackgroundPage();
    };

    /**
     * Macht die benötigten Daten nach außen hin bekannt.
     */
    var exportValuesToBackgroundPage = function() {
        window.mediaList = mediaList;
    };

    /**
     * Initialisiert das background-Modul.
     * Dazu wird die Verarbeitung der Nachrichten initialisiert und die benötigten Werte nach außen
     * bekannt gegeben.
     */
    var init = function(){
        extension.handleMessage(handleCurrentMediaMessage);
        exportValuesToBackgroundPage();
    }();
});