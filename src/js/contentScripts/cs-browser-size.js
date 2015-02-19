require([
    'jquery', 'extension'
],
/**
 * Content Script zur Ermittlung der aktuellen und maximalen Browsergröße.
 * @exports csBrowserSize
 * @param {Object} $ - JQuery
 * @param {module} extension - extension-Modul
 * @see module:extension
 */
function($, extension){
    /**
     * Berechnet bei Skalierung des Browsers dessen Größe erneut.
     */
    var updateBrowserSizeOnResize = function(){
        $(window).resize(function(){
            updateBrowserSize();
        });
    };

    /**
     * Berechnet die aktuelle Browsergröße und stößt die Aktualisierung in Background Page und Popup an.
     */
    var updateBrowserSize = function() {
        extension.sendMessage({
            type: extension.messageTypes.updateBrowserSize,
            data: {
                innerBrowserHeight: window.innerHeight,
                outerBrowserHeight: window.outerHeight,
                innerBrowserWidth: window.innerWidth,
                outerBrowserWidth: window.outerWidth
            }
        });
    };

    /**
     * Stößt das Aktualisieren der maximalen Browser-Größe an.
     */
    var updateAvailBrowserSize = function(){
        extension.sendMessage({
            type: extension.messageTypes.updateAvailBrowserSize,
            data: {
                availBrowserHeight: window.screen.availHeight,
                availBrowserWidth: window.screen.availWidth
            }
        });
    };

    /**
     * Berechnet die benötigten Größen erneut, wenn die Hintergrundseite aktualisiert werden soll.
     */
    var handleUpdateBackgroundPageMessage = function(){
        updateAvailBrowserSize();
        updateBrowserSize();
    };

    /**
     * Behandelt die Nachrichten, die an das Content Script gesendet werden.
     */
    var handleMessages = function() {
        extension.handleMessage(extension.messageTypes.updateBackgroundPage, handleUpdateBackgroundPageMessage);
    };

    /**
     * Initialisiert die Ermittlung der aktuellen und maximalen Browsergröße.
     */
    var init = function(){
        updateBrowserSize();
        updateBrowserSizeOnResize();
        updateAvailBrowserSize();
        handleMessages();
    }();
});