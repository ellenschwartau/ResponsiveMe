// TODO Variable rausnehmen, wenn keine Tests mehr geschrieben werden
var requireJsConfig = {
    // Basispfad der Javaskript Dateien
    baseUrl: '/js',
    // Vorhandene Module und Libs
    paths: {
        // libs
        jquery: 'libs/jquery-1.11.2.min',
        codeEditor: 'libs/ace/ace',
        aceLanguageTools: 'libs/ace/ext-language_tools',
        // Konfiguration
        config: 'modules/config',
        // Helper
        extension: 'helper/extension',
        codeEditorHelper: 'helper/ace-helper',
        tools: 'helper/tools',
        // Popup
        popup: 'popup/popup',
        modules: 'popup/module',
        settings: 'popup/settings',
        // Viewport
        viewport: 'modules/viewport/viewport',
        viewportAnimation: 'modules/viewport/viewport-animation',
        viewportSize: 'modules/viewport/viewport-size',
        browserOffset: 'modules/viewport/browser-offset',
        // Grid
        grid: 'modules/grid/grid',
        visualizeElements: 'modules/grid/visualize-elements',
        // Media Queries
        mediaQueries: 'modules/mediaQueries/media-queries',
        newMediaQuery: 'modules/mediaQueries/new-media-query',
        showMediaQueries: 'modules/mediaQueries/show-media-queries',
        matchMedia: 'modules/mediaQueries/match-media',
        // Style-Sheets
        stylesheetParser: 'modules/mediaQueries/stylesheet-parser',
        styleEditor: 'modules/mediaQueries/style-editor'

    }
};
require.config(requireJsConfig);
