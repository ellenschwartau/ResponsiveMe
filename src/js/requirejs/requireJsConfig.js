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
        // Hintergrundseite
        backgroundAccess: 'background/background-access',
        // Konfiguration
        config: 'config',
        // Helper
        extension: 'helper/extension',
        codeEditorHelper: 'helper/ace-helper',
        tools: 'helper/tools',
        localStorage: 'helper/local-storage',
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
        allMediaQueries: 'modules/mediaQueries/all-media-queries',
        matchMedia: 'modules/mediaQueries/match-media',
        activeMediaQueries: 'modules/mediaQueries/active-media-queries',
        csMediaQueries: 'contentScripts/cs-media-queries',
        // Style-Sheets
        stylesheetParser: 'helper/styles/stylesheet-parser',
        styleEditor: 'helper/styles/style-editor',
        mediaQueryParser: 'helper/styles/media-query-parser'
    }
};
require.config(requireJsConfig);
