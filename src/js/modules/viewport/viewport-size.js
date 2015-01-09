/**
 * Stellt Funktionen zur Skalierung des Browser-Fenster bereit.
 */
define(
    ['jquery', 'browserOffset']
    ,
    function($, browserOffset) {
         /**
         * Berechnet die Zielbreite, auf die der Browser skaliert werden muss.
         * @param width                     int         Zielbreite
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         * @returns int
         */
        var calcDestWidth = function(width, containsBrowserOffset) {
            // Browser-Breite aufaddieren, damit der Content selbst die Zielbreite hat
            return containsBrowserOffset ? width : width + browserOffset.getWidth();
        };

        /**
         * Berechnet die Zielhöhe, auf die der Browser skaliert werden muss.
         * @param height                    int         Zielhöhe
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         * @returns int
         */
        var calcDestHeight = function(height, containsBrowserOffset) {
            // Browser-Höhe aufaddieren, damit der Content selbst die Zielhöhe hat
            return containsBrowserOffset ? height : height + browserOffset.getHeight();
        };

        /**
         * Skaliert das Browser-Fenster mit Hilfe der chrome.windows-API.
         * @param width     int     Breite, auf die der Browser skaliert werden soll
         * @param height    int     Höhe, auf die der Browser skaliert werden soll
         */
        var changeSize = function(width, height) {
            updateWindowSize({
                width: width,
                height: height
            });
        };

        /**
         * Skaliert die Breite des Browsers.
         * @param width     int     Breite, auf die der Browser skaliert werden soll
         */
        var changeWidth = function(width) {
            updateWindowSize({
                width: width
            });
        };

        /**
         * Skaliert die Höhe des Browsers.
         * @param height    int     Höhe, auf die der Browser skaliert werden soll
         */
        var changeHeight = function(height) {
            updateWindowSize({
                height: height
            });
        };

        /**
         * Aktualisiert das Browserfenster mit der gegebenen Information.
         * @param updateInfo    Object  in JSON angegebene Attribute des Browserfensters
         */
        var updateWindowSize = function(updateInfo) {
            updateInfo.state = "normal";
            chrome.windows.update(chrome.windows.WINDOW_ID_CURRENT, updateInfo);
        };

        /**
         * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebenen Maße.
         * @param width                     int         Ziel-Browser-Breite
         * @param height                    int         Ziel-Browser-Breite
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         */
        var calcAndChangeSize = function(width, height, containsBrowserOffset) {
            changeSize(calcDestWidth(width, containsBrowserOffset), calcDestHeight(height, containsBrowserOffset));
        };

        /**
         * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebene Breite.
         * @param width                     int         Ziel-Browser-Breite
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         */
        var calcAndChangeWidth = function(width, containsBrowserOffset) {
            changeWidth(calcDestWidth(width, containsBrowserOffset));
        };

        /**
         * Skaliert das Browserfenster oder den Inhalt der Seite auf die gegebene Hlhe.
         * @param height                     int        Ziel-Browser-Höhe
         * @param containsBrowserOffset     boolean     Angabe, ob die Zielbreite den Browser mit einbezieht
         */
        var calcAndChangeHeight = function(height, containsBrowserOffset) {
            changeHeight(calcDestHeight(height, containsBrowserOffset));
        };

        /**
         * Passt die aktuelle Anzeige je nach Einstellung des Inner/Outer-Switch an,
         * die Breite und Höhe der Browserelemente werden also zur Größe dazuaddiert oder abgezogen.
         * @param containsBrowserOffset  boolean  Angabe, ob die Größenangaben die Größte der
         *                                        Browserelemente (z.B. Toolbar) mit einbezieht
         */
        var toggleInnerOuter = function(containsBrowserOffset) {
            chrome.windows.getCurrent(function(window){
                // Im Falle dass containsBrowserOffset true:
                // Es wurde von Inner auf Outer getogglet, BrowserOffset muss dann wieder abgezogen werden
                // Wenn containsBrowserOffset true, werden der Offset innerhalb der changeSize aufaddiert
                var width = window.width,
                    height = window.height;
                if(containsBrowserOffset) {
                    width -= browserOffset.getWidth();
                    height -= browserOffset.getHeight();
                } else {
                    width += browserOffset.getWidth();
                    height += browserOffset.getHeight();
                }
                changeSize(width, height);
            });
        };

        /**
         * Initialisiert die Angaben, wie viel Pixel der Browser horizontal wie auch vertikal einnimmt
         * (dazu zählen beispielsweise Tool- oder Scrollbars).
         * Weil die Abfrage Asynchron erfolgt, sollte diese Initialisierung so früh wie möglich stattfinden.
         */
        var init = function() {
            browserOffset.init();
        };

        return {
            changeSize: calcAndChangeSize,
            changeWidth: calcAndChangeWidth,
            changeHeight: calcAndChangeHeight,
            toggleInnerOuter: toggleInnerOuter,
            init: init
        }
    }
);