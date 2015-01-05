/**
 * Modifiziert die Projekt-Konfiguration zur Ausführung von Unit Tests.
 * TODO brauche ich das wirklich?
 */
;(function() {
    var fs = require('fs');
    exports.init = function() {
        try {
            // Konfigurationsdatei auslesen
            var data = fs.readFileSync('js/requireConfig.js', 'ascii');
        } catch(e) {
            console.error(e);
            return {};
        }
        // Ausführen um requireJsConfig Object zu initialisieren
        eval(data.toString());
        // absoluter Pfad Prefix für die Test Suite
        var pathPrefix = _dirname + '/../..';

        // Modififikationen
        var config = requirejsConfig; // TODO wieder als Variable anlegen
        config.baseUrl = pathPrefix + rc.baseUrl;
        var path;
        for(path in rc.paths) {
            if(typeof rc.paths[path] == 'string') {
                rc.paths[path] = pathPrefix + rc.paths[path];
            }
        }
        return rc;
    }
}).call(this);
