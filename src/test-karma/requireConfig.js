/**
 * Modifiziert die Projekt-Konfiguration zur Ausführung von Unit Tests.
 */
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

    var tests = [];
    for (var file in window.__karma__.files) {
        if (window.__karma__.files.hasOwnProperty(file)) {
            if (/Spec\.js$/.test(file)) {
                tests.push(file);
            }
        }
    }

    //ask Require.js to load these files (all our tests)
    console.log("Testdateien: " + tests);
    config.deps = tests;
    // start test run, once Require.js is done
    config.callback = function(){
        console.log("Karma starten...");
        window.__karma__.start();
        console.log("... Karma wurde gestartet.");
    };
    console.log("require config laden");
    require(config);
});