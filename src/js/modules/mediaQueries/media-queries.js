/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 * Es liest die in den Style Sheets der aufgerufenen Website enthaltenen Media Queries aus und bringt diese zur Anzeige.
 * Über einen Mausklick auf den Selektor der Media Query kann anschließend an die Stelle gesprungen werden,
 * an der diese Media Query greift.
 */
define([
    'jquery', 'extension', 'config', 'stylesheetParser', 'viewportSize'
],
function($, extension, config, stylesheetParser, viewportSize) {
    var $contentWrapper,            // Parent Element des Modul-Inhalts
        $showMediaQueriesButton,    // Button zum Anzeigen der Media Queries
        $hideMediaQueriesButton =    // Button um de Media Queries wieder auszublenden
            $("<a id='hideMediaQueriesButton' class='button'>Media Queries ausblenden</a>"),
        $mediaQueries,              // Container für die angezeigten Media Queries
        $mediaQueryHtml =           // Vorlage für eine Media Query
            $("<div class='mediaQuery'>" +
                "<h4></h4>" +
                "<p class='style'></p>" +
            "</div>"),
        MSG_NO_MEDIA_QUERIES_FOUND =
            "Es sind keine Media Queries vorhanden.";  // Meldung, falls keine Media Queries gefunden wurden

    /**
     * Ermittelt die Media Queries, die in den Styles der Website vorhanden sind.
     */
    var getMediaQueries = function() {
        return stylesheetParser.getMediaQueries();
    };

    /**
     * Erstellt das Markup für eine Media Query.
     * @param mediaQuery    JSON    Daten der Media Query
     */
    var createMarkup = function(mediaQuery){
        // Vorlage inklusive Event-Handler klonen und Werte setzen
        var $query = $mediaQueryHtml.clone(true),
            $heading = $query.find("h4"),
            $style = $query.find(".style"),
            mediaQueryWidth = mediaQuery.mediaQueryWidth;

        $heading.html(mediaQuery.selector);
        $style.html(mediaQuery.style);
        if(mediaQueryWidth > -1) {
            // Button über den auf die Breite gesprungen werden kann, bei dem die Media Query greift
            var $button = $("<a class='button'>Auf " + mediaQueryWidth + "px skalieren</a>");
            $button.click(function() {
                // Browser auf die angegebene Breite skalieren, wenn auf eine Media Query geklickt wird
                viewportSize.changeWidth(mediaQueryWidth, false);
            });
            $style.after($button);
        }

        return $query;
    };

    /**
     * Konvertiert die Informationen über die Media Queries in HTML-Elemente und zeigt diese an.
     * @param response  JSON    Antwort der getMediaQueries-Methode
     */
    var showMediaQueries = function(response){
        // Eventuell vorher angezeigte Media Queries löschen
        $mediaQueries.empty();
        var data = response.data;
        if(data.length > 0) {
            // neue Media Queries einfügen
            $.each(data, function(i, mediaQuery){
                $mediaQueries.append(createMarkup(mediaQuery));
            });
            $showMediaQueriesButton.after($hideMediaQueriesButton);
        } else {
            // Meldung ausgeben, falls keine vorhanden sind
            $mediaQueries.html(MSG_NO_MEDIA_QUERIES_FOUND);
        }
    };

    /**
     * Initialisiert die Anzeige der Media Queries.
     */
    var initMediaQueryDisplay = function() {
        $showMediaQueriesButton.click(function(){
            // Media Queries von Content Script abfragen
            extension.sendMessageToTabWithCb({
                    type: config.messageTypes.showMediaQueries
                },
                // erhaltene Antwort verarbeiten und Media Queries anzeigen
                showMediaQueries
            );
        });
        $hideMediaQueriesButton.click(function(){
            $mediaQueries.empty();
            $hideMediaQueriesButton.remove();
        });
    };

    /**
     * Registriert die Callbacks zur Anzeige auf der Vorlage für die Media Queries.
     */
    var initMediaQueryItemDisplay = function(){
        $mediaQueryHtml.click(function(){
            $(this).find(".style").toggle();
        });
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        // TODO Konstante?
        $contentWrapper = $("#showMediaQueries");
        $showMediaQueriesButton = $("#showMediaQueriesButton");
        $mediaQueries = $("#mediaQueries");
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function() {
        viewportSize.init();
        initElements();
        initMediaQueryDisplay();
        initMediaQueryItemDisplay();
    };

    return {
        init: init,
        get: getMediaQueries
    };
});