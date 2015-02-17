require([
    'jquery', 'matchMedia', 'extension'
],
/**
 * Hintergrundseite der Erweiterung.
 * Sie läuft durchgehend im Hintergrund und hält Daten und Funktionen zur Kommunikation zwischen
 * den einzelnen Bestandteilen der Erweiterung bereit.
 * @exports background
 * @param {module} extension - extension-Modul
 * @see module:extension
 */
function(extension){
    var outerBrowserHeight,     // äußere Browser Höhe
        innerBrowserHeight,     // innere Browser Höhe
        outerBrowserWidth,      // äußere Browser Breite
        innerBrowserWidth,      // innere Browser Breite
        availBrowserHeight,     // verfügbare Höhe
        availBrowserWidth,      // verfügbare Breite
        browserOffset = {       // Browser Offset
            x: 0,
            y: 0
        },
        mediaList;              // aktuell greifende Media Queries

    /**
     * Berechnet ausgehend von den inner und outer Browsergrößen den Offset des Browsers,
     * also den Platz den dieser beispielsweise durch Scroll- und Toolbars einnimmt.
     * @param {{outerBrowserHeight: int, innerBrowserHeight: int, outerBrowserWidth: int, innerBrowserWidth: int}} data - Größenangaben
     */
    var calcBrowserOffset = function(data){
        browserOffset.x = data.outerBrowserWidth - data.innerBrowserWidth;
        browserOffset.y = data.outerBrowserHeight - data.innerBrowserHeight;
        exportBrowserOffsetToBackgoundPage();
    };

    /**
     * Speichert die inner und outer Größe des Browsers zwischen.
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
     * Behandelt die aktuelle Browsergröße bei einer Skalierung des Browsers.
     * Die Größenangaben werden dabei aktualisiert und der Browser Offset neu berechnet.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentBrowserSizeMessage = function(request){
        var data = request.data;
        saveBrowserSizes(data);
        calcBrowserOffset(data);
    };

    /**
     * Aktualisiert die aktuell greifenden Media Queries.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        mediaList = request.data.mediaList;
        exportMediaListToBackgoundPage();
    };

    /**
     * Aktualisiert die erreichbare Browser-Größe.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleAvailBrowserSizeMessage = function(request){
        var data = request.data;
        availBrowserHeight = data.availBrowserHeight;
        availBrowserWidth = data.availBrowserWidth;
        exportAvailBrowserSizeToBackgroundPage();
    };

    /**
     * Sendet die Nachricht, dass die Hintergrundseite aktualisiert werden muss.
     */
    var triggerUpdateBackgroundPage = function(){
        extension.sendMessageToTab({
            type: extension.messageTypes.updateBackgroundPage
        });
    };

    /**
     * Sendet zu bestimmten Events die Nachricht, dass die Variablen der Hintergundseite aktualisiert werden sollen.
     * Diese Nachricht wird gesendet, wenn der aktive Tab gewechselt, ein Tab in ein Fenster hineingezogen,
     * oder das aktuelle Fenster gewechselt wird.
     */
    var registerUpdateBackgroundPageMessage = function(){
        extension.onActivatedTab(triggerUpdateBackgroundPage);
        extension.onAttachedTab(triggerUpdateBackgroundPage);
        extension.onFocusChangedWindow(triggerUpdateBackgroundPage);
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
     * Gibt die aktuell greifenden Media Queries der Hintergundseite bekannt.
     */
    var exportMediaListToBackgoundPage = function(){
        window.mediaList = mediaList;
    };

    /**
     * Gibt den Browser Offset der Hintergundseite bekannt.
     */
    var exportBrowserOffsetToBackgoundPage = function(){
        window.browserOffset = browserOffset;
    };

    /**
     * Gibt die aktuelle Größe des Browsers der Hintergundseite bekannt.
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
        registerUpdateBackgroundPageMessage();
        extension.handleMessage(extension.messageTypes.displayCurrentMediaList, handleCurrentMediaMessage);
        extension.handleMessage(extension.messageTypes.updateBrowserSize, handleCurrentBrowserSizeMessage);
        extension.handleMessage(extension.messageTypes.updateAvailBrowserSize, handleAvailBrowserSizeMessage);
        exportValuesToBackgroundPage();
    }();
});