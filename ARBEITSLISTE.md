# Arbeitsliste: Übung, Prüfungsfragen und Quellen nachrüsten

Stand 27.10.2026. Reihenfolge nach Besucherzahlen aus der Search Console
(5 Wochen bis 26.10.2026). Oben zuerst.

## Erledigt am 27.10.2026
- en/mathematik/drei-tueren-problem.html
- es/mathematik/drei-tueren-problem.html
- biologie/zellatmung.html (zusätzlich Inhaltsverzeichnis, Stufen-Schaubild, Verwechslungen)
- en/biologie/zellatmung.html (dito)

## Als Nächstes, in dieser Reihenfolge
1. physik/volt-ampere-watt.html — EN-Fassung ist vollständig, als Vorlage nehmen (inkl. Rechner)
2. es/physik/volt-ampere-watt.html — ES ist zusätzlich inhaltlich dünn, Abschnitte aus EN ergänzen
3. physik/schroedingers-katze.html — EN-Fassung als Vorlage
4. es/physik/schroedingers-katze.html — dito
5. es/physik/fallgeschwindigkeit.html — DE und EN sind fertig, als Vorlage nehmen
6. Danach der Rest der Seiten ohne Paket, Kategorie für Kategorie

## Regeln, die dabei gelten
- Quellen immer in der Sprache der Seite und vor dem Einbau mit einem Abruf
  prüfen. Keine Adresse aus dem Gedächtnis schreiben.
- Übung: fünf Fragen, drei Optionen, `data-loesung` zählt ab 0.
- `uebung.js` einbinden: Wurzelseiten `../uebung.js`, `/en/` und `/es/` `../../uebung.js`.
- Inhaltsverzeichnis um die neuen Abschnitte ergänzen, Anker müssen zu den ids passen.
- ids dürfen nicht mit einer Ziffer beginnen.
- Nach dem Einbau prüfen: doppelte ids, tote Anker, Sprachreste aus anderen Fassungen.
- sitemap.xml: lastmod der geänderten Seiten auf das Tagesdatum setzen.
