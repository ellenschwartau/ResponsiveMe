/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 */
define([
    'jquery', 'extension', 'config', 'stylesheetParser'
],
function($, extension, config, stylesheetParser, codemirror, codemirrorCssMode) {
    var $contentWrapper,            // Parent Element des Modul-Inhalts
        $showMediaQueriesButton,    // Button zum Anzeigen der Media Queries
        $mediaQueries,              // Container für die angezeigten Media Queries
        $mediaQueryHtml =           // Vorlage für eine Media Query
            $("<div class='mediaQuery'>" +
                "<h4></h4>" +
                "<p class='style'></p>" +
            "</div>"),
        MSG_NO_MEDIA_QUERIES_FOUND = "Es sind keine Media Queries vorhanden.";

    /**
     * Initialisiert die Anzeige der Media Queries.
     */
    var initShowMediaQueries = function() {
        $showMediaQueriesButton.click(function(){
            extension.sendMessageToTabWithCb({
                type: config.messageTypes.showMediaQueries
            },
                showMediaQueries
            );
        });
    };

    /**
     * Zeigt die Media Queries an
     */
    var getMediaQueries = function() {
        return stylesheetParser.getMediaQueries();
    };

    /**
     * Erstellt das Markup für eine Media Query.
     * @param mediaQuery    JSON    Daten der Media Query
     */
    var createMarkup = function(mediaQuery){
        // Vorlage inklusive Event-Handler Klonen
        var query = $mediaQueryHtml.clone(true);
        query.find("h4").html(mediaQuery.selector);
        query.find(".style").html(mediaQuery.style);
        return query;
    };

    /**
     * Konvertiert die Informationen über die Media Queries in HTML-Elemente und zeigt diese an.
     * @param response  JSON    Antwort der getMediaQueries-Methode
     */
    var showMediaQueries = function(response){
        $mediaQueries.empty();
        if(response.data.length > 0) {
            $.each(response.data, function(i, mediaQuery){
                $mediaQueries.append(createMarkup(mediaQuery));
            });
        } else {
            $mediaQueries.html(MSG_NO_MEDIA_QUERIES_FOUND);
        }
    };

    /**
     * Registriert die Callbacks zur Anzeige auf der Vorlage für die Media Queries.
     */
    var initMediaQueryDisplay = function(){
        var $querySelector = $mediaQueryHtml.find("h4");
        $mediaQueryHtml.hover(function(){
            $(this).find(".style").toggle();
        });
        $querySelector.click(function(){
           // TODO jump to width
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
        initElements();
        initShowMediaQueries();
        initMediaQueryDisplay();
    };

    return {
        init: init,
        get: getMediaQueries
    };
});