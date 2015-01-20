// TODO Variable rausnehmen, wenn keine Tests mehr geschrieben werden
var requireJsConfig = {
    // Basispfad der Javaskript Dateien
    baseUrl: '/js',
    // Vorhandene Module und Libs
    paths: {
        ace: 'libs/ace/ace',
        aceHelper: 'helper/ace-helper',
        jquery: 'libs/jquery-1.11.2.min',
        config: 'modules/config',
        // Helper
        extension: 'extension',
        // Popup
        popup: 'popup/popup',
        modules: 'popup/module',
        settings: 'popup/settings',
        // Viewport
        viewport: 'modules/viewport/viewport',
        viewportAnimation: 'modules/viewport/viewport-animation',
        viewportSize: 'modules/viewport/viewport-size',
        browserOffset: 'modules/viewport/browser-offset',
        // Visualisierung
        grid: 'modules/grid/grid',
        visualizeElements: 'modules/grid/visualize-elements',
        mediaQueries: 'modules/mediaQueries/media-queries',
        stylesheetParser: 'modules/mediaQueries/stylesheet-parser'
    }
};
require.config(requireJsConfig);
