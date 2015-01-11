/**
 * Modul zur Visualisierung von Grids und Media Queries.
 */
define([
    'jquery'
],
function($){
    // Benötigte Selektoren
    var showGrid = "#showGrid",
        addSelectorButton = "#addSelectorButton",
        showMediaQueries = "#showMediaQueries";

    /**
     * Initialisiert den Button zum Hinzufügen neuer Selektoren.
     * Bei einem Klick auf den Button wird ein neues Input-Element vor dem Button hinzugefügt.
     */
    var initAddSelectorButton = function() {
        // delegated Event Handling --> http://learn.jquery.com/events/event-delegation/
        // Um Events bei Elementen zu registrieren, die nachgeladen werden und zum Zeitpunkt der Initialisierung
        // noch nicht vorhanden sind
        $("#popup-content").on("click",  addSelectorButton, function(){
            var $lastInput = $(showGrid).find("input").last();
            $lastInput.after($lastInput.clone());
        });
    };

    var init = function() {
        initAddSelectorButton();
    };

    return {
        init: init
    }
});
