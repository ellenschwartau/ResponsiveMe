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
        browserOffset = {
            x: 0,
            y: 0
        },
        mediaList;

    /**
     * Berechnet ausgehend von den inner und outer Browsergrößen den Offset des Browsers,
     * den er beispielsweise durch Scroll- und Toolbars einnimmt.
     * @param {{outerBrowserHeight: int, innerBrowserHeight: int, outerBrowserWidth: int, innerBrowserWidth: int}} data - Größenangaben
     */
    var calcBrowserOffset = function(data){
        browserOffset.x = data.outerBrowserWidth - data.innerBrowserWidth;
        browserOffset.y = data.outerBrowserHeight - data.innerBrowserHeight;
        exportBrowserOffsetToBackgoundPage();
    };

    /**
     * Speichert die inner und outer Größe des Browsers zwischen
     * und gibt diese Werte der Hintergrundseite bekannt.
     * @param {{outerBrowserHeight: int, innerBrowserHeight: int, outerBrowserWidth: int, innerBrowserWidth: int}} data - Größenangaben
     */
    var saveBrowserSizes = function(data) {
        outerBrowserHeight = data.outerBrowserHeight;
        innerBrowserHeight = data.innerBrowserHeight;
        outerBrowserWidth = data.outerBrowserWidth;
        innerBrowserWidth = data.innerBrowserWidth;
        exportBrowserSizeToBackgroundPage();
    };

    /**
     * Behandelt die Aktuelle Browser-Größe bei einer Größenänderung.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentBrowserSizeMessage = function(request){
        var data = request.data;
        saveBrowserSizes(data);
        calcBrowserOffset(data);
    };

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        mediaList = request.data.mediaList;
        exportMediaListToBackgoundPage();
    };

    /**
     * Behandelt die erreichbare Browser-Größe.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleAvailBrowserSizeMessage = function(request){
        var data = request.data;
        availBrowserHeight = data.availBrowserHeight;
        availBrowserWidth = data.availBrowserWidth;
        exportAvailBrowserSizeToBackgroundPage();
    };

    /**
     * Gibt die benötigten Daten der Hintergraundseite bekannt.
     */
    var exportValuesToBackgroundPage = function() {
        exportMediaListToBackgoundPage();
        exportBrowserOffsetToBackgoundPage();
        exportBrowserSizeToBackgroundPage();
        exportAvailBrowserSizeToBackgroundPage();
    };

    /**
     * Gibt die Greifenden Media Angaben der Hintergundseite bekannt.
     */
    var exportMediaListToBackgoundPage = function(){
        window.mediaList = mediaList;
    };

    /**
     * Gibt den Browser-Offset der Hintergundseite bekannt.
     */
    var exportBrowserOffsetToBackgoundPage = function(){
        window.browserOffset = browserOffset;
    };

    /**
     * Gibt die Greifenden aktuelle Größe des Browsers der Hintergundseite bekannt.
     */
    var exportBrowserSizeToBackgroundPage = function(){
        window.outerBrowserHeight = outerBrowserHeight;
        window.innerBrowserHeight = innerBrowserHeight;
        window.outerBrowserWidth = outerBrowserWidth;
        window.innerBrowserWidth = innerBrowserWidth;
    };

    /**
     * Gibt die erreichbare Größe des Browsers der Hintergundseite bekannt.
     */
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