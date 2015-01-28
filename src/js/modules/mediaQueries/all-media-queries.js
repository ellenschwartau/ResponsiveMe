define([
    'jquery', 'extension', 'config', 'stylesheetParser', 'viewportSize', 'codeEditorHelper', 'styleEditor'
],
/**
 * Dieses Modul dient der Visualisierung von Media Queries.
 * Es liest die in den Style Sheets der aufgerufenen Website enthaltenen Media Queries aus und bringt diese zur Anzeige.
 * Über einen Mausklick auf den Selektor der Media Query kann anschließend an die Stelle gesprungen werden,
 * an der diese Media Query greift.
 * Die Media Queries können außerdem über die vorhandenen Code Editoren bearbeitet werden.
 * @exports allMediaQueries
 * @param {Object} $ - JQuery
 * @param {module} extension - extensionModul
 * @see module:extension
 * @param {module} config - config-Modul
 * @see module:config
 * @param {module} stylesheetParser - stylesheetParser-Modul
 * @see module:stylesheetParser
 * @param {module} viewportSize - viewportSize-Modul
 * @see module:viewportSize
 * @param {module} aceHelper - codeEditorHelper-Modul
 * @see module:codeEditorHelper
 * @param {module} styleEditor - styleEditor-Modul
 * @see module:styleEditor
 * @returns {{init: Function, show: Function, get: Function}}
 */
function($, extension, config, stylesheetParser, viewportSize, aceHelper, styleEditor) {
    var $mediaQueries,                                  // Container für die angezeigten Media Queries
        $showMediaQueriesButton,                        // Button zum Anzeigen der Media Queries
        ID_PREFIX_MEDIA_QUERY = "media-query-",         // Prefix der IDs der Media Query Elemente
        MSG_NO_MEDIA_QUERIES_FOUND =
            "Es sind keine Media Queries vorhanden.",   // Meldung, falls keine Media Queries gefunden wurden
        $hideMediaQueriesButton =                       // Button um de Media Queries wieder auszublenden
            $("<a id='hideMediaQueriesButton' class='button'>Media Queries ausblenden</a>"),
        $mediaQueryHtml =                                   // Vorlage für eine Media Query
            $("<div class='mediaQuery'>" +
                "<h4></h4>" +
                "<div class='editor'></div>" +
            "</div>");

    /**
     * Ermittelt die Media Queries, die in den Styles der Website vorhanden sind.
     * @return {json}
     */
    var getMediaQueries = function() {
        return stylesheetParser.getMediaQueries();
    };

    /**
     * Erstellt das Markup für eine Media Query.
     * @param {json} mediaQuery - Daten der Media Query
     * @param {int} mediaQuery.styleSheetIndex - Index des Style Sheets in der StyleSheetList
     * @param {int} mediaQuery.ruleIndex - Index, an dem die Regel der CSSRuleList hinzugefügt werden soll
     * @param {string} mediaQuery.fullCSss - Gesamtes CSS der Regel
     * @param {int} mediaQuery.mediaQueryWidth - obere Grenze der Breite, ab der die Media Query greift (-1 wenn keine Breite angegeben)
     * @param {string} mediaQuery.selector - Selektor der CSS Regel
     * @param {string} id - CSS-ID der Media Query
     */
    var createMediaQueryMarkup = function(mediaQuery, id){
        var $query = $mediaQueryHtml.clone(),
            $heading = $query.find("h4"),
            $style = $query.find(".editor"),
            mediaQueryWidth = mediaQuery.mediaQueryWidth;

        // Inhalte setzen
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
     * @param {int} mediaQueryWidth - Breite, auf die der Browser skaliert werden soll
     * @param {$} $insertAfterElm - Element, nach dem der Button eingefügt werden soll
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
     * @param {json} response - Antwort der getMediaQueries-Methode
     * @param {json} response.data - Daten der Antwort
     */
    var showMediaQueries = function(response){
        // Eventuell vorher angezeigte Media Queries löschen
        $mediaQueries.empty();
        var data = response.data;
        if(data.length > 0) {
            // neue Media Queries einfügen
            $.each(data, function(i, mediaQuery){
                var id = ID_PREFIX_MEDIA_QUERY + i;
                $mediaQueries.append(createMediaQueryMarkup(mediaQuery, id));
                aceHelper.initCodeEditor(id, mediaQuery, saveMediaQuery);
            });
            $showMediaQueriesButton.after($hideMediaQueriesButton);
        } else {
            // Meldung ausgeben, falls keine vorhanden sind
            $mediaQueries.html(MSG_NO_MEDIA_QUERIES_FOUND);
        }
    };


    /**
     * Triggert die Aktualisierung eines Styles in ein bestimmtes Style Sheet.
     * @param {string} style - css Style
     * @param {int} indexStyleSheet - Index des Style Sheets aus der Liste der geladenen Style Sheets
     * @param {int} indexRule - Index der CSSRule aus der Liste der Regeln eines bestimmten Style Sheets
     * @param {string} id - CSS-ID des Editors
     */
    var saveMediaQuery = function(style, indexStyleSheet, indexRule, id){
        styleEditor.triggerUpdateStyle(style, indexStyleSheet, indexRule);
        // Media Query Element löschen, wenn der neue Style leer ist
        if(style == "") {
            removeMediaQuery(id);
        }
    };

    /**
     * Löscht sowohl das HTML-Element des Editors, sowie den Eintrag in der Editoren Liste.
     * @param {string} id - CSS-ID des Editors
     */
    var removeMediaQuery = function(id) {
        $("#" + id).parent().remove();
        aceHelper.removeEditorFromList(id);
    };

    /**
     * Initialisiert das Ausblenden der Media Queries.
     */
    var initHideMediaQueries = function() {
        $hideMediaQueriesButton.click(function(){
            $mediaQueries.empty();
            $hideMediaQueriesButton.remove();
        });
    };

    /**
     * Speichert die Interaktionselemente zwischen.
     */
    var initElements = function() {
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
        initHideMediaQueries();
    };

    return {
        init: init,
        show: showMediaQueries,
        get: getMediaQueries
    };
});