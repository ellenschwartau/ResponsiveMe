# ResponsiveMe
ResponsiveMe ist ein Chrome-Plugin zur vereinfachten Umsetzung von Websites im Responsive Design.
Es stellt verschiedene Funktionen bereit, die die Entwicklung von anpassungsfähigen Websites erleichtern soll. 
Dazu gehört beispielsweise die Skalierung des Browsers, die Visualisierung des zugrundeliegendes Grids, sowie die Anzeige und Bearbeitbarkeit der vorhandenen oder neuer Media Queries.

## Viewport
Das Viewport-Modul bietet die Möglichkeit, die Website in verschiedenen Pixelbreiten zu betrachten und stellt dafür verschiedene Funktionen bereit.
Dazu gehört beispielsweise die Möglichkeit eine bestimmten Pixelangabe für die Breite oder Höhe des Browsers einzustellen, wobei diese Angaben maximal die Auflösung des Bildschirms annehmen können. Als Untergrenze dient bei der Breite die Mindest-Breite des Browsers, die im Falle von Chrome bei 299px liegt.
Des weiteren bietet dieses Tool verschiedene vordefinierte Auflösungen an, die zur Manipulation der Breite ausgewählt werden können. Die angegebenen Größen Orientieren sich dabei an Studien, die die Untersuchungen zu den gängigsten Bildschirmbreiten angestellt haben.   
Auch die Animation der Browserbreite kann vorgenommen werden, bei der der Start- und Endwert, die gewünschte Dauer und Anzahl an Wiederholungen eingestellt werden kann.
Einstellbar ist außerdem, ob sich die Breitenangaben auf den Inhalt selbst beziehen oder auch das Browser-Fenster selbst (also beispielsweise die Toolbar oder Scrollbar) mit einschließen.

## Grid
Dieses Modul kann genutzt werden, um das zugrungeliegende Raster eine Seite sichtbar zu machen. Da diese Raster durch verschiedenste Elemente oder Klassen spezifiziert werden können, muss es eine übergreifend einsetzbare Methode geben, um die Bestandteile dieses Rasters zu identifizieren. Für diesen Zweck, können die Selektoren der Elemente, aus denen das Grid aufgebaut ist, durch ihre Selektoren angegeben werden. Diese müssen der CSS-Syntax entsprechen, die es auch ermöglicht reguläre Ausdrücke zu verwenden. Die so angegebenen Elemente können anschließend über eine Umrandung in definierbarer Farbe und Dicke angezeigt werden.

## Media Queries
Das Media Query Modul dient der Darstellung der Media Queries und ermöglicht es, sich die vorhandenen Media Queries anzeigen zu lassen. Enthalten diese eine Breitenangabe, wird ein Button bereit gestellt, mit dem zur entsprechenden Größe gesprungen werden kann. Auch die aktuell greifenden Media Angaben werden angezeigt und bei Browserskalierung aktualisiert. Durch bereitgestellt Code Editoren können die vorhandenen Media Queries bearbeitet, sowie neue hinzugefügt werden.

# Setup
## Entpackte Erweiterung laden
src/* Ordner herunterladen und über Chrome einbinden. 
Dazu muss innerhalb der Erweiterungen unter den Einstellungen des Browsers der Entwicklermodus aktiviert und über die Schaltfläche „Entpackte Erweiterung laden...“ der Oberordner, in dem die Dateien liegen, ausgewählt werden (siehe [chrome://extensions/]).

## Gepackte Erweiterung laden
.crx-Datei zur Installation verwenden.
