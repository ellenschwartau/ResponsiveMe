define([
    'jquery', 'extension', 'config', 'backgroundAccess'
], function($, extension, config, backgroundAccess){
    var $matchedMediaElement,       // Element, in dem die greifenden Media Angaben angezeigt werden sollen
        MSG_NO_MEDIAS = "-",        // Nachricht, die ausgegeben wird, wenn aktuell keine Media Queries greifen
        $mediaElement = $("<li></li>");

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        if(request.type === config.messageTypes.displayCurrentMediaList) {
            setMatchMedia(request.data.mediaList)
        }
    };

    /**
     * Setzt den Inhalt des Media-Elements und zeigt die übergebenen Media-Angaben in der Liste an.
     * Ist die Liste leer, wird eine entsprechende Nachricht angezeigt.
     * @param {String[]} mediaList - Liste an Media-Angaben
     */
    var setMatchMedia = function(mediaList) {
        $matchedMediaElement.empty();
        if(mediaList.length == 0){
            $matchedMediaElement.html(MSG_NO_MEDIAS);
        } else {
            $.each(mediaList, function(i, media) {
                var $element = $mediaElement.clone();
                $element.html(media);
                $matchedMediaElement.append($element);
            })
        }
    };

    /**
     * Initialisiert die Anzeige der greifenden Media Queries.
     */
    var init = function(){
        $matchedMediaElement = $("#matchedMedia");
        // TODO Message Handling muss eventuell ausgelagert werden, wenn mehrere Nachrichten verarbeitet werden sollen
        extension.handleMessage(handleCurrentMediaMessage);
        setMatchMedia(backgroundAccess.getMediaList());
    };

    return {
        init: init,
        setMatchMedia: setMatchMedia
    };
});
