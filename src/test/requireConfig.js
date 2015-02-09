/**
 * Modifiziert die Projekt-Konfiguration zur Ausführung von Unit Tests.
 */
var init = function() {
    $.get('base/js/requirejs/config.js', function(data){
        // Ausführen um requireJsConfig Object zu initialisieren
        eval(data.toString());
        // absoluter Pfad Prefix für die Test Suite
        var pathPrefix = '/base/js/';

        // Modififikationen
        var config = requireJsConfig;
        config.baseUrl = pathPrefix + config.baseUrl;
        for(var path in config.paths) {
            if(typeof config.paths[path] == 'string') {
                config.paths[path] = pathPrefix + config.paths[path];
            }
        }
        require(config);
    });
}();
