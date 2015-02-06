require([
    'jquery', 'matchMedia', 'stylesheetParser', 'extension'
],
/**
 * Content Script zur Verarbeitung der aktuellen Media Angaben.
 * @exports csMediaQueries
 * @param {Object} $ - JQuery
 * @param {module} matchMedia - matchMedia-Modul
 * @see module:matchMedia
 * @param {module} styleSheetParser - stylesheetParser-Modul
 * @see module:stylesheetParser
 * @param {module} extension - extension-Modul
 * @see module:extension
 */
function($, matchMedia, styleSheetParser, extension){
    /**
     * Berechnet bei Skalierung des Browsers die zutreffenden Media Angaben aus den Media Queries.
     */
    var updateMatchedMediaOnResize = function(){
        $(window).resize(function(){
            updateMediaList();
        });
    };

    /**
     * Berechnet die aktuell greifenden Media Angaben und triggert die Aktualisierung in Background Page und Popup.
     */
    var updateMediaList = function() {
        extension.sendMessage({
            type: extension.messageTypes.displayCurrentMediaList,
            data: {
                mediaList: matchMedia.getMatchedMedia()
            }
        });
    };

    /**
     * Liest die Media Queries aus den Style Sheets aus.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {MessageSender} sender - Enthält Informationen über den Absender
     * @param {function} sendResponse - Funktion zum Absenden einer Antwort
     */
    var handleShowMediaQueries = function(request, sender, sendResponse) {
        sendResponse({
            data: styleSheetParser.getMediaQueries()
        });
    };

    /**
     * Berechnet die aktuell greifenden Media Queries erneut, wenn die Hintergrundseite aktualisiert werden soll.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {MessageSender} sender - Enthält Informationen über den Absender
     * @param {function} sendResponse - Funktion zum Absenden einer Antwort
     */
    var handleUpdateBackgroundPageMessage = function(request, sender, sendResponse){
        updateMediaList();
    };

    /**
     * Berechnet die aktuell greifenden Media Queries erneut, wenn explizit ein Request hierfür gesendet wird.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     * @param {string} request.type - Typ der Nachricht, zur Angabe, welche Aktion folgen soll
     * @param {json} request.data - zusätzliche Daten der Nachricht
     * @param {MessageSender} sender - Enthält Informationen über den Absender
     * @param {function} sendResponse - Funktion zum Absenden einer Antwort
     */
    var handleUpdateActiveMedaQueries = function(request, sender, sendResponse){
        updateMediaList();
    };

    /**
     * Behandelt die Nachrichten, die an das Content Script gesendet werden.
     */
    var handleMessages = function() {
        extension.handleMessage(extension.messageTypes.showMediaQueries, handleShowMediaQueries);
        extension.handleMessage(extension.messageTypes.updateBackgroundPage, handleUpdateBackgroundPageMessage);
        extension.handleMessage(extension.messageTypes.updateActiveMediaQueries, handleUpdateActiveMedaQueries);
    };

    /**
     * Initialisiert die Ermittlung der aktuell greifenden Media-Angaben.
     */
    var init = function(){
        updateMediaList();
        updateMatchedMediaOnResize();
        handleMessages();
    }();
});
