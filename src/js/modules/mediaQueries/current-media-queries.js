define([
    'jquery', 'extension', 'config'
], function($, extension, config){
    var $matchedMediaElement,       // Element, in dem die greifenden Media Angaben angezeigt werden sollen
        MSG_NO_MEDIAS = "-",        // Nachricht, die ausgegeben wird, wenn aktuell keine Media Queries greifen
        $mediaElement = $("<li></li>");

    /**
     * Behandelt die Anzeige der aktuell greifenden Media Angaben.
     * @param {{type:string, data:json}} request - Daten und Typ der Anfrage
     */
    var handleCurrentMediaMessage = function(request){
        if(request.type === config.messageTypes.displayCurrentMediaList) {
            $matchedMediaElement.empty();
            var mediaList = request.data.mediaList;
            if(mediaList.length == 0){
                $matchedMediaElement.html(MSG_NO_MEDIAS);
            } else {
                $.each(request.data.mediaList, function(i, media) {
                    var $element = $mediaElement.clone();
                    $element.html(media);
                    $matchedMediaElement.append($element);
                })
            }
        }
    };

    /**
     * Initialisiert die Anzeige der greifenden Media Queries.
     */
    var init = function(){
        $matchedMediaElement = $("#matchedMedia");
        // TODO Message Handling muss eventuell ausgelagert werden, wenn mehrere Nachrichten verarbeitet werden sollen
        extension.handleMessage(handleCurrentMediaMessage);
    };

    return {
        init: init
    };
});
