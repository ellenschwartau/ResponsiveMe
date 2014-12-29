require.config({
    // per default moduleIDs auf js/modules laden
    baseUrl: '/js',
    // optional andere Pfade für bestimmte module definieren
    paths: {
        jquery: 'libs/jquery-1.11.2.min',
        popup: 'modules/popup/popup'
    }
});

require(
    ['jquery', 'popup']
,
function($, popup) {
    // javascript initialisieren
    $.each([
        popup
    ], function(i, item) {
       item.init();
    });
});