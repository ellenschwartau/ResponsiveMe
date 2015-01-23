require([
    'matchMedia', 'stylesheetParser'
], function(matchMedia, stylesheetParser){
    var mediaList;  // Liste der Media-Angaben innerhalb der Media Queries

    /**
     * Liefert die Media Angaben, die innerhalb der Media Queries vorhanden sind.
     * @returns {string[]}
     */
    var getMediaList = function() {
        return stylesheetParser.getMediaList();
    };

    console.log("Media Angaben: " + getMediaList());
});
