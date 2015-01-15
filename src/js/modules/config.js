/**
 * Enthält Konfigurationen der Erweiterung, wie vordefinierte Auflösungen und die zu ladenden Module.
 */
define([
],
function() {
    var baseDir = "modules/",       // Basispfad zu den Modulen
        modules = [                 // Module, die eingebunden werden sollen
            "viewport",
            "visualize",
            "template"
        ],
        resolutions = [             // vordefinierte Display-Auflösungen
            {name: "1920x1080", width: 1920, height: 1200},
            {name: "1366x768", width: 1366, height: 768},
            {name: "1280x800", width: 1280, height: 800},
            {name: "1024x768", width: 1024, height: 768},
            {name: "800x600", width: 800, height: 600},
            {name: "640x960", width: 640, height: 960},
            {name: "320x480", width: 320, height: 480}
        ],
    // TODO in ein Message Handling Modul, oder mit in extension.js?
        messageTypes = {            // Type, zur Identifikation der Nachrichten, die zwischen
            showGrid: "showGrid",    // den Komponenten der Erweiterung verschickt werden
            showMediaQueries: "showMediaQueries",
            windowResize: "windowResize"
        };

    return {
        baseDir: baseDir,
        modules: modules,
        resolutions: resolutions,
        messageTypes: messageTypes
    };
});
