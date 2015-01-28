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
    var outerBrowserHeight,
        innerBrowserHeight,
        outerBrowserWidth,
        innerBrowserWidth,
        availBrowserHeight,
        availBrowserWidth,
        mediaList;

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        mediaList = request.data.mediaList;
        exportBrowserSizeToBackgroundPage();
    };

    var handleCurrentBrowserSizeMessage = function(request){
        var data = request.data;
        outerBrowserHeight = data.outerBrowserHeight;
        innerBrowserHeight = data.innerBrowserHeight;
        outerBrowserWidth = data.outerBrowserWidth;
        innerBrowserWidth = data.innerBrowserWidth;
        exportMediaListToBackgoundPage();
    };

    /**
     *
     * @param request
     */
    var handleAvailBrowserSizeMessage = function(request){
        var data = request.data;
        availBrowserHeight = data.availBrowserHeight;
        availBrowserWidth = data.availBrowserWidth;
        exportAvailBrowserSizeToBackgroundPage();
    };

    /**
     * Macht die benötigten Daten nach außen hin bekannt.
     */
    var exportValuesToBackgroundPage = function() {
        exportMediaListToBackgoundPage();
        exportBrowserSizeToBackgroundPage();
        exportAvailBrowserSizeToBackgroundPage();
    };

    var exportMediaListToBackgoundPage = function(){
        window.mediaList = mediaList;
    };

    var exportBrowserSizeToBackgroundPage = function(){
        window.outerBrowserHeight = outerBrowserHeight;
        window.innerBrowserHeight = innerBrowserHeight;
        window.outerBrowserWidth = outerBrowserWidth;
        window.innerBrowserWidth = innerBrowserWidth;
    };

    var exportAvailBrowserSizeToBackgroundPage = function(){
        window.availBrowserHeight = availBrowserHeight;
        window.availBrowserWidth = availBrowserWidth;
    };

    /**
     * Initialisiert das background-Modul.
     * Dazu wird die Verarbeitung der Nachrichten initialisiert und die benötigten Werte nach außen
     * bekannt gegeben.
     */
    var init = function(){
        extension.handleMessage(config.messageTypes.displayCurrentMediaList, handleCurrentMediaMessage);
        extension.handleMessage(config.messageTypes.updateBrowserSize, handleCurrentBrowserSizeMessage);
        extension.handleMessage(config.messageTypes.updateAvailBrowserSize, handleAvailBrowserSizeMessage);
        exportValuesToBackgroundPage();
    }();
});