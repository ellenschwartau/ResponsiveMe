/**
 * Javascript der popup.html - übernimmt das Triggern der Modul-Aktionen sowie deren Ein- und Ausblenden.
 */
define(
    ['jquery']
    ,
function($) {
    var init = function () {
        console.log($);
        $(document).ready(function () {
            $(".module").each(function () {
                var toggleContent = $(this).find(".module-content");
                $(this).on("click", function () {
                    toggleContent.toggle();
                });
            });
        });
    };

    return {
        init: init
    };
});