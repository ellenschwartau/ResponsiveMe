/**
 * Javascript, dass auf aufgerufene Seiten injiziert wird.
 */
requirejs.config(requireJsConfig);
requirejs(
    ['jquery']
,
    function($) {
        // $($.find("body")).css("background", "red");
});
