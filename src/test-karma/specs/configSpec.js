console.log("Test Datei wird geladen");
require(['config'], function(config){
    console.log("innerhalb require");
    describe("Unit Test zum Testen der Konfigurationen", function() {
        console.log("Aufrühren des Describe");
        it("Die benötigten Konfigurationen sollten definiert sein", function() {
            console.log("Ausführen it");
            expect(true).toBe(true);
        });
    });
});