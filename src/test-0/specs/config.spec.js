var requirejs = require('requirejs');
var rc = require('../modules/requireConfig.js');
requirejs.config(rc.init());
var config = requirejs('config');

describe("Unit Test zum Testen der Konfigurationen", function() {
    it("Die benötigten Konfigurationen sollten definiert sein", function() {
        expect(config).toBeDefined();
        expect(config.baseDir).toBeDefined();
        expect(config.modules).toBeDefined();
        expect(config.resolutions).toBeDefined();
        expect(config.defaultGridColor).toBeDefined();
    });
});
