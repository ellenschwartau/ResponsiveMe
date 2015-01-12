/**
 * Modul zur Visualisierung von Grids und Media Queries.
 */
define([
    'jquery', 'extension'
],
function($, extension){
    // Benötigte Selektoren
    var showGrid = "#showGrid",
        addSelectorButton = "#addSelectorButton",
        showGridButton = "#showGridButton",
        showMediaQueries = "#showMediaQueries";

    /**
     * Initialisiert den Button zum Hinzufügen neuer Selektoren.
     * Bei einem Klick auf den Button wird ein neues Input-Element vor dem Button hinzugefügt.
     */
    var initAddSelectorButton = function() {
        // TODO Doku: Keine Delegated Events
        // delegated Event Handling --> http://learn.jquery.com/events/event-delegation/l
        // Um Events bei Elementen zu registrieren, die nachgeladen werden und zum Zeitpunkt der Initialisierung
        // noch nicht vorhanden sind
        $(addSelectorButton).click(function(){
            var $lastInput = $(showGrid).find("input").last();
            $lastInput.after($lastInput.clone());
        });
    };

    /**
     * Initialisiert die Anzeige des Grids.
     */
    var initShowGrid = function() {
        $(showGridButton).click(function(){
            extension.sendMessageToTab({type: "showGrid"});
        });
    };

    /**
     * Initialisiert das Visualize-Modul.
     */
    var init = function() {
        initAddSelectorButton();
        initShowGrid();
    };

    return {
        init: init
    }
});
