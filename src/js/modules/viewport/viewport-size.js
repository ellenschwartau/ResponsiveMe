define([
    'browserOffset', 'extension'
],
/**
 * Stellt Funktionen zur Skalierung des Browsers bereit.
 * @exports viewportSize
 * @param {module} browserOffset - browserOffest-Modul
 * @see module:browserOffset
 * @param {module} extension - extensionModul
 * @see module:extension
 * @returns {{changeSize: Function, changeWidth: Function, changeHeight: Function, toggleInnerOuter: Function}}
 */
function(browserOffset, extension) {
     /**
     * Berechnet die Zielbreite, auf die der Browser skaliert werden muss.
     * @param {int} width - Breite, auf die der Browser skaliert werden soll
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielbreite die Abmessungen des Browsers mit einbezieht
     * @returns {int}
      */
    var calcDestWidth = function(width, containsBrowserOffset) {
        // Browser-Breite aufaddieren, damit der Content selbst die Zielbreite hat
        return containsBrowserOffset ? width : width + browserOffset.get().x;
    };

    /**
     * Berechnet die Zielhöhe, auf die der Browser skaliert werden muss.
     * @param {int} height - Höhe, auf die der Browser skaliert werden soll
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielbreite die Abmessungen des Browsers mit einbezieht
     * @returns {int}
     */
    var calcDestHeight = function(height, containsBrowserOffset) {
        // Browser-Höhe aufaddieren, damit der Content selbst die Zielhöhe hat
        return containsBrowserOffset ? height : height + browserOffset.get().y;
    };

    /**
     * Skaliert den Browser mit Hilfe der chrome.windows-API.
     * @param {int} width - Breite, auf die der Browser skaliert werden soll
     * @param {int} height - Höhe, auf die der Browser skaliert werden soll
     */
    var changeSize = function(width, height) {
        updateWindowSize({
            width: width,
            height: height
        });
    };

    /**
     * Skaliert die Breite des Browsers.
     * @param  {int} width - Breite, auf die der Browser skaliert werden soll
     */
    var changeWidth = function(width) {
        updateWindowSize({
            width: width
        });
    };

    /**
     * Skaliert die Höhe des Browsers.
     * @param {int} height - Höhe, auf die der Browser skaliert werden soll
     */
    var changeHeight = function(height) {
        updateWindowSize({
            height: height
        });
    };

    /**
     * Aktualisiert das Browserfenster mit der gegebenen Information.
     * @param {json} updateInfo - in JSON angegebene Attribute des Browserfensters
     */
    var updateWindowSize = function(updateInfo) {
        updateInfo.state = "normal";
        chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, updateInfo);
    };

    /**
     * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebenen Maße.
     * @param {int} width - Breite, auf die der Browser skaliert werden soll
     * @param {int} height - Höhe, auf die der Browser skaliert werden soll
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielbreite ddie Abmessungen des Browsers mit einbezieht
     */
    var calcAndChangeSize = function(width, height, containsBrowserOffset) {
        changeSize(
            calcDestWidth(width, containsBrowserOffset),
            calcDestHeight(height, containsBrowserOffset)
        );
    };

    /**
     * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebene Breite.
     * @param {int} width - Breite, auf die der Browser skaliert werden soll
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielbreite die Abmessungen des Browsers mit einbezieht
     */
    var calcAndChangeWidth = function(width, containsBrowserOffset) {
        changeWidth(calcDestWidth(width, containsBrowserOffset));
    };

    /**
     * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebene Höhe.
     * @param {int} height - Höhe, auf die der Browser skaliert werden soll
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielhöhe die Abmessungen des Browsers mit einbezieht
     */
    var calcAndChangeHeight = function(height, containsBrowserOffset) {
        changeHeight(calcDestHeight(height, containsBrowserOffset));
    };

    /**
     * Passt die aktuelle Anzeige je nach Einstellung des Inner/Outer-Switch an,
     * die Breite und Höhe der Browserelemente werden also zur Größe dazuaddiert oder abgezogen.
     * @param {boolean} containsBrowserOffset - Angabe, ob die Zielbreite den Browser mit einbezieht
     */
    var toggleInnerOuter = function(containsBrowserOffset) {
        extension.getCurrentWindow(function(window){
            // Im Falle dass containsBrowserOffset true:
            // Es wurde von Inner auf Outer getogglet, BrowserOffset muss dann wieder abgezogen werden
            var width = window.width,
                height = window.height,
                offset = browserOffset.get();
            if(containsBrowserOffset) {
                width -= offset.x;
                height -= offset.y;
            } else {
                width += offset.x;
                height += offset.y;
            }
            changeSize(width, height);
        });
    };

    return {
        changeSize: calcAndChangeSize,
        changeWidth: calcAndChangeWidth,
        changeHeight: calcAndChangeHeight,
        toggleInnerOuter: toggleInnerOuter
    }
});