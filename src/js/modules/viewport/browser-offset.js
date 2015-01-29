define([
        'extension', 'backgroundAccess'
],
/**
 * Dient zum Auslesen des Browser-Offsets, also dem Platz den dieser beispielsweise durch Tool- oder Scrollbars
 * einnimmt, auf der Background Page.
 *
 * @exports browserOffset
 * @param {module} backgroundAccess - backgroundAccess-Modul
 * @see module:backgroundAccess
 * @returns {{get: Function}}
 */
function(backgroundAccess) {
    /**
     * Liefert den Offset in Pixeln, der der Browser (z.B. durch Toolbar oder Scrollbar) einnimmt.
     * @returns {{x: int, y: int}}
     */
    var getBrowserOffset = function() {
        return backgroundAccess.getBrowserOffset();
    };

    return {
        get: getBrowserOffset
    };
});
