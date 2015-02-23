define([
    'jquery', 'extension', 'backgroundAccess'
],
/**
 * Modul zur Anzeige der aktuell greifenden Media Queries.
 * @exports activeMediaQueries
 * @param {Object} $ - JQuery
 * @param {module} extension - extensionModul
 * @see module:extension
 * @param {module} backgroundAccess - backgroundAccess-Modul
 * @see module:backgroundAccess
 * @returns {{init: Function}}
 */
function($, extension, backgroundAccess){
    var $matchedMediaElement,           // Element, in dem die greifenden Media Angaben angezeigt werden sollen
        MSG_NO_MEDIAS = "-",            // Nachricht, die ausgegeben wird, wenn aktuell keine Media Queries greifen
        $mediaElement = $("<li></li>"); // Markup eines Listen-Elements der aktuell greifenden Media-Angaben

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Queries.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        showMatchedMediaQueries(request.data.mediaList)
    };

    /**
     * Zeigt die Liste an Media Queries im dafür vorgesehenen Element an.
     * Ist die Liste leer, wird eine entsprechende Nachricht angezeigt.
     * @param {String[]} mediaList - Liste an Media-Angaben
     */
    var showMatchedMediaQueries = function(mediaList) {
        $matchedMediaElement.empty();
        if(mediaList != null){
            if(mediaList.length == 0){
                $matchedMediaElement.html(MSG_NO_MEDIAS);
            } else {
                $.each(mediaList, function(i, media) {
                    var $element = $mediaElement.clone();
                    $element.html(media);
                    $matchedMediaElement.append($element);
                })
            }
        }
    };

    /**
     * Initialisiert die Anzeige der aktuell greifenden Media Queries.
     */
    var init = function(){
        $matchedMediaElement = $("#matchedMedia");
        extension.handleMessage(extension.messageTypes.displayCurrentMediaList, handleCurrentMediaMessage);
        showMatchedMediaQueries(backgroundAccess.getMediaList());
    };

    return {
        init: init
    };
});
