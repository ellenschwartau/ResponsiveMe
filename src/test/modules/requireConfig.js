/**
 * Modifiziert die Projekt-Konfiguration zur Ausführung von Unit Tests.
 * TODO brauche ich das wirklich?
 */
;(function() {
    var fs = require('fs');
    exports.init = function() {
        try {
            // Konfigurationsdatei auslesen
            var data = fs.readFileSync('../js/requirejs/config.js', 'ascii');
        } catch(e) {
            console.error(e);
            return {};
        }
        // Ausführen um requireJsConfig Object zu initialisieren
        eval(data.toString());
        // absoluter Pfad Prefix für die Test Suite
        var pathPrefix = __dirname + '/../../js/';

        // Modififikationen
        var config = requireJsConfig;
        config.baseUrl = pathPrefix + config.baseUrl;
        for(var path in config.paths) {
            if(typeof config.paths[path] == 'string') {
                config.paths[path] = pathPrefix + config.paths[path];
            }
        }
        return config;
    }
}).call(this);
