var requirejs = require('requirejs');
var rc = require('../modules/requireConfig.js');
requirejs.config(rc.init());
//var popup = requirejs('popup');
describe("Sample unit test", function() {
    it("Test", function() {
        expect(true).toBe(true);
    });
    //it("Sollte Popup kennen", function() {
    //    //expect(popup.init()).toBeDefined();
    //})
});