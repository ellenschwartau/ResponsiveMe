/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 * Es liest die in den Style Sheets der aufgerufenen Website enthaltenen Media Queries aus und bringt diese zur Anzeige.
 * Über einen Mausklick auf den Selektor der Media Query kann anschließend an die Stelle gesprungen werden,
 * an der diese Media Query greift.
 */
define([
    'jquery', 'extension', 'config', 'stylesheetParser', 'viewportSize', 'aceHelper'
],
function($, extension, config, stylesheetParser, viewportSize, aceHelper) {
    var $contentWrapper,            // Parent Element des Modul-Inhalts
        $showMediaQueriesButton,    // Button zum Anzeigen der Media Queries
        $hideMediaQueriesButton =    // Button um de Media Queries wieder auszublenden
            $("<a id='hideMediaQueriesButton' class='button'>Media Queries ausblenden</a>"),
        $mediaQueries,              // Container für die angezeigten Media Queries
        $mediaQueryHtml =           // Vorlage für eine Media Query
            $("<div class='mediaQuery'>" +
                "<h4></h4>" +
                "<div class='editor'></div>" +
            "</div>"),
        MSG_NO_MEDIA_QUERIES_FOUND =
            "Es sind keine Media Queries vorhanden.",  // Meldung, falls keine Media Queries gefunden wurden
        ID_PREFIX_MEDIA_QUERY = "media-query-",       // Prefix der IDs der Media Query Elemente
        editorNewMediaQuery = "newMediaQuery";

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
    var createMarkup = function(mediaQuery, id){
        var $query = $mediaQueryHtml.clone(),
            $heading = $query.find("h4"),
            $style = $query.find(".editor"),
            mediaQueryWidth = mediaQuery.mediaQueryWidth;

        // Inahlte setzen
        $heading.html(mediaQuery.selector);
        $style.attr("id", id);

        // Callbacks setzen
        $heading.click(function(){
            $style.toggle();
        });
        // Button zum Browser skalieren einfügen, wenn die Media Query eine Breiten-Angabe enthält
        if(mediaQueryWidth > -1) {
            addScaleButton(mediaQueryWidth, $style);
        }

        return $query;
    };

    /**
     * Fügt einen Button nach dem übergebenen Element an, über den der Browser auf eine bestimmte Breite skaliert
     * werden kann.
     * @param mediaQueryWidth   Breite, auf die der Browser skaliert werden soll
     * @param $insertAfterElm   Element, nach dem der Button eingefügt werden soll
     */
    var addScaleButton = function(mediaQueryWidth, $insertAfterElm) {
        // Button über den auf die Breite gesprungen werden kann, bei dem die Media Query greift
        var $button = $("<a class='button'>Auf " + mediaQueryWidth + "px skalieren</a>");
        $button.click(function() {
            // Browser auf die angegebene Breite skalieren, wenn auf eine Media Query geklickt wird
            viewportSize.changeWidth(mediaQueryWidth, false);
        });
        $insertAfterElm.after($button);
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
                var id = ID_PREFIX_MEDIA_QUERY + i;
                $mediaQueries.append(createMarkup(mediaQuery, id));
                aceHelper.initCodeEditor(id, mediaQuery);
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
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
        $contentWrapper = $("#showMediaQueries");
        $showMediaQueriesButton = $("#showMediaQueriesButton");
        $mediaQueries = $("#mediaQueries");
    };

    var initNewMediaQuery = function() {
        aceHelper.initCodeEditor(editorNewMediaQuery, "");
    };

    var initCodeEditor = function(){
        aceHelper.initCodeEditor("editor", ".test{width:50%}");
    };

    /**
     * Initialisiert das Media Query Modul.
     * Die benötigten Elemente werden ausgelesen und die notwendigen Callbacks gesetzt.
     */
    var init = function() {
        viewportSize.init();
        initElements();
        initMediaQueryDisplay();
        initCodeEditor();
        initNewMediaQuery();
    };

    return {
        init: init,
        get: getMediaQueries
    };
});