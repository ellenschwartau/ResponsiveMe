var requirejs = require('requirejs');
var requireConfig = {
    // Basispfad der Javaskript Dateien
    baseUrl: '/js',
    // Vorhandene Module und Libs
    paths: {
        jquery: 'libs/jquery-1.11.2.min',
        popup: 'modules/popup/popup',
        modules: 'modules/popup/module',
        settings: 'modules/popup/settings',
        viewport: 'modules/viewport/viewport'
    }
};
var rc = require('../modules/requireConfig.js');
requirejs.config(rc.init());

//requirejs.config({
//    // Basispfad der Javaskript Dateien
//    baseUrl: '/src/js',
//    // Vorhandene Module und Libs
//    paths: {
//        jquery: 'libs/jquery-1.11.2.min',
//        popup: 'modules/popup/popup',
//        modules: 'modules/popup/module',
//        settings: 'modules/popup/settings',
//        viewport: 'modules/viewport/viewport'
//    }
//});

var popup = requirejs('popup');

// Include what we need to include: this is specific to jasmine-node
//require("../src/test.js");

describe("Sample unit test", function() {
    it("Test", function() {
        expect(true).toBe(true);
    });
    ir("Sollte Popup kennen", function() {
        expect(popup.init()).toBeDefined();
    })
});