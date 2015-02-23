define([
        'backgroundAccess'
],
/**
 * Dient zum Auslesen des Browser Offsets aus der Background Page,
 * also dem Platz den der Browser beispielsweise durch Tool- oder Scrollbars einnimmt.
 * @exports browserOffset
 * @param {module} backgroundAccess - backgroundAccess-Modul
 * @see module:backgroundAccess
 * @returns {{get: Function}}
 */
function(backgroundAccess) {
    /**
     * Liefert den Offset in Pixeln, den der Browser (z.B. durch Toolbar oder Scrollbar) einnimmt.
     * @returns {{x: int, y: int}}
     */
    var getBrowserOffset = function() {
        return backgroundAccess.getBrowserOffset();
    };

    return {
        get: getBrowserOffset
    };
});
