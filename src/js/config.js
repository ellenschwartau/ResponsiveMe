define([
],
/**
 * Enthält Konfigurationen der Erweiterung, wie vordefinierte Auflösungen und die zu ladenden Module.
 * @exports config
 * @returns {{baseDir: string, modules: Array, resolutions: Array, defaultGridColor: string}}
 */
function() {
    var baseDir = "modules/",           // Basispfad zu den Modulen
        modules = [                     // Module, die eingebunden werden sollen
            "viewport",
            "grid",
            "media-queries"
        ],
        resolutions = [                 // vordefinierte Display-Auflösungen
            {name: "1920x1080", width: 1920, height: 1200},
            {name: "1366x768", width: 1366, height: 768},
            {name: "1280x800", width: 1280, height: 800},
            {name: "1024x768", width: 1024, height: 768},
            {name: "800x600", width: 800, height: 600},
            {name: "640x960", width: 640, height: 960},
            {name: "320x480", width: 320, height: 480}
        ],
        defaultGridColor = "#FF8000";   // Default-Farbe zur Visualisierung des Grids

    return {
        baseDir: baseDir,
        modules: modules,
        resolutions: resolutions,
        defaultGridColor: defaultGridColor
    };
});
