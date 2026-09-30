# BLACK PEARL — Analytische Tools (§11 Master Specification v3)

Arbeitsstand. **Nicht veröffentlicht, nicht deployed, keine Domain verbunden.**

Diese Module sind eigenständige, in sich geschlossene HTML-Dateien. Sie laufen ohne
Framer, ohne Build-Schritt und ohne externe Skripte. Ihre Berechnungslogik ist damit
unabhängig von Framer (Regel 4).

## Sprache

Hauptsprache der Module ist **Englisch** (Entscheidung des Eigentümers, 30.09.2026).
Deutsche und russische Fassungen folgen später im Zuge der Lokalisierung nach §4.

Die Zahlenformatierung steht bewusst weiterhin auf `de-DE` (also `2.000.000` statt
`2,000,000`). Das ist ein Lokalisierungsdetail, das zusammen mit den Sprachfassungen
entschieden werden sollte — es ist eine reine Anzeigeoption und berührt keine
Berechnung.

## Grundregel für alle Module: Nachweis statt Zusicherung

Berechnungslogik, Formeln, Steuersätze und Schwellenwerte werden **nicht verändert**.

Da die Übersetzung ins Englische auch Beschriftungen betrifft, die als Zeichenketten
*innerhalb* des Script-Blocks liegen, ist ein reiner Textvergleich des Skripts kein
brauchbarer Nachweis mehr. Stattdessen gilt ein **funktionaler Nachweis**: Beide
Fassungen werden mit identischen Ausgangswerten geladen, und sämtliche berechneten
Ausgabefelder werden maschinell verglichen. Abweichungen dürfen ausschließlich
Beschriftungen betreffen, niemals Zahlen.

Dieser Test ist pro Modul zu wiederholen und im jeweiligen Abschnitt protokolliert.

## Farb- und Typografie-Zuordnung

| Original | BLACK PEARL | Herkunft |
|---|---|---|
| `--paper` `#F6F7F9` | `#F3F0EA` | Token BG/Light (§2.3) |
| `--ink` `#16202E` | `#161616` | Token Text/Dark (§2.3) |
| `--muted` `#5B6675` | `#8E8B86` | Token Text/Muted (§2.3) |
| CTA-Fläche | `#0B0B0B` / `#F4F1EB` | Token BG/Dark + Text/Light (§2.3) |
| `--panel` `#FFFFFF` | `#FCFBF8` | abgeleitet: warmes Off-White, da reines Weiß gegen das warme Elfenbein kalt wirkt |
| `--rule` `#D9DEE5` | `#DCD8D0` | abgeleitet: warme Haarlinie |
| `--teal` `#0E6E6B` | `#2E4A43` | Statusfarbe „ok", entsättigt |
| `--amber` `#B45309` | `#6B5426` | Statusfarbe „warn", entsättigt — bewusst **kein** Gold (§2.3) |
| `--red` `#A4262C` | `#6E2F2F` | Statusfarbe „bad", entsättigt |
| Source Serif 4 | DM Serif Display | §2.3 |
| IBM Plex Sans | Inter | §2.3 |

Die drei Statusfarben bleiben unterscheidbar, verlieren aber den Signal-Charakter.
Eckenradien wurden von 6 px auf 2 px reduziert (§2.3 „square/low-radius geometry").

---

## 1. `/tools/uae-corporate-tax` — fertig

**Originaldatei:** `~/Desktop/bhatti-cleveland_second_layer/modul-steuern-vae.html`
**Zieldatei:** `uae-corporate-tax.html`

### Vorgenommene Änderungen

| Änderung | Art |
|---|---|
| `<title>` → „UAE Corporate Tax — BLACK PEARL" | redaktionell (Fremdmarke entfernt) |
| Font-Einbindung IBM Plex Sans + Source Serif 4 → Inter + DM Serif Display | rein visuell |
| `:root`-Tokenblock auf BLACK-PEARL-Palette umgestellt | rein visuell |
| `h1`/`h2` Schriftstärke 600 → 400, Größen minimal angehoben | rein visuell (DM Serif Display kennt nur einen Schnitt; 600 hätte zu synthetischem Fettdruck geführt) |
| Eckenradien 6 px → 2 px | rein visuell |
| CTA-Block: Calendly-Link und Querverweise auf die beiden Nachbarmodule entfernt | **funktional relevant**, siehe unten |
| Neuer, getrennter `<script>`-Block „Integrationsschicht" am Dateiende | additiv, keine Berechnung |

| Sämtliche Beschriftungen und Fließtexte ins Englische übersetzt | redaktionell |

### Wurde funktionale Logik angefasst?

**Nein — maschinell nachgewiesen.**

Beide Fassungen wurden mit den identischen Modellwerten geladen und alle berechneten
Ausgabefelder verglichen (Tabelle B, Gegenprobe, Small-Business-Relief-Kennzahlen,
Beschriftungen der Zinsschranken-Grafik):

```
verglichene Felder:                 58
Abweichungen gesamt:                 5
davon mit abweichender Zahl:         0
```

Die fünf Abweichungen sind ausschließlich übersetzte Beschriftungen
(„Natürliche Person" → „Natural person", „Nicht-ansässig" → „Non-resident",
„nein" → „no"). Sämtliche Beträge, Prozentsätze und Schwellenwerte stimmen exakt
überein.

Keine Formel, kein Steuersatz, keine Freibetragsgrenze und kein Schwellenwert wurde
verändert. Rechtsstände und Paragraphenangaben sind inhaltlich unverändert übernommen
und lediglich übersetzt; die Fundstellen selbst (Federal Decree-Law No. 47 of 2022,
Cabinet Decisions, Ministerial Decision No. 131 of 2026) stehen wortgleich.

**Achtung bei der Übersetzung juristischer Passagen:** Ich habe den Sinn so genau wie
möglich übertragen, bin aber kein Prüfer für englische Steuerterminologie. Die Abschnitte
„Legal basis" und „Methodology" sowie die Bewertungstexte gehören vor Veröffentlichung
fachlich gegengelesen (§17).

Zwei funktional relevante Eingriffe außerhalb des Rechenkerns:

1. **Calendly entfernt.** Das Original verlinkte auf `calendly.com/arman-bhatti/30min`.
   §10 legt fest, dass der Kalenderanbieter noch offen ist und ohne Freigabe weder
   ausgewählt noch aktiviert werden darf. An seiner Stelle steht ein Button, der
   **keine Buchung auslöst**, sondern nur eine Nachricht an das einbettende Fenster
   sendet.
2. **Querverweise entfernt.** Die Links auf `modul-steuern-de.html` und
   `modul-development.html` zeigten auf das andere Projekt. Die Navigation zwischen den
   Tools gehört in den `/tools`-Hub in Framer, nicht in den iframe.

### Einbettung in Framer

Als `<iframe>` auf der Seite `/tools/uae-corporate-tax`. Das Modul meldet sich beim
übergeordneten Fenster über `postMessage`:

```js
// Höhe (bei Laden, Resize und jeder Eingabe)
{ type: 'bp-tool-height', tool: 'uae-corporate-tax', height: <number> }

// Klick auf „Book a Consultation"
{ type: 'bp-tool-cta', tool: 'uae-corporate-tax', action: 'book-consultation' }
```

Im Framer-Projekt wird dazu ein Code-Override oder ein Embed-Element gebraucht, das

- auf `bp-tool-height` reagiert und die iframe-Höhe setzt (verhindert doppelte
  Scrollbalken und erfüllt §14 „must not overflow mobile width"),
- auf `bp-tool-cta` reagiert und den einheitlichen Buchungs-Flow nach §10 öffnet.

Solange dieser Flow nicht existiert, passiert beim Klick schlicht nichts — es entsteht
keine tote Buchungsstrecke und kein falsches Versprechen.

### Offene Punkte zur Prüfung durch den Eigentümer

- Rechtsstände im Fußbereich (u. a. „Ministerial Decision No. 131 of 2026 vom
  29.07.2026", Umsatzschwelle AED 3 Mio., Verlängerung bis 31.12.2029) sind unverändert
  aus dem Original übernommen und **nicht** von mir geprüft.
- Die Modellwerte der Regler (Kaufpreis AED 2 Mio., Portfolio-Faktor 25 usw.) stammen
  aus dem Original.
- Die englischen Fassungen der Abschnitte „Legal basis", „Methodology" und der
  Bewertungstexte sind Übersetzungen durch mich und fachlich ungeprüft.
- Zahlenformat weiterhin `de-DE`, siehe Abschnitt „Sprache".

---

## 2. `/tools/german-tax-layer` — fertig

**Originaldatei:** `~/Desktop/bhatti-cleveland_second_layer/modul-steuern-de.html`
**Zieldatei:** `german-tax-layer.html`

Inhalt: laufende Besteuerung von vier Strukturen im Vergleich, § 23 EStG
(Veräußerungsgewinn und Zehnjahresfrist), § 6 AStG (Wegzugsbesteuerung mit
Ratenbarwert), §§ 7 ff. AStG (Hinzurechnungskaskade), § 2 AStG und § 2a EStG.

### Vorgenommene Änderungen

Identisches Muster wie Modul 1: Tokens, Schriften, Überschriftenstärke, Eckenradien,
CTA-Block, getrennte Integrationsschicht, vollständige Übersetzung ins Englische.

Zusätzlich modulspezifisch:

| Änderung | Art |
|---|---|
| Deutsche Paragraphenzitate von „§ 7 Abs. 1, 2 AStG" auf die im Englischen übliche Form „§ 7(1), (2) AStG" umgestellt | redaktionell; Norm und Fundstelle unverändert |
| Anzeigefehler im Original behoben: die Kennzahl „Stundungsvorteil" endete auf `' der Steuer);'` und gab die überzähligen Zeichen `);` sichtbar aus | kosmetisch; zeigt jetzt „32,8 % of the tax" |

Die internen Code-Kommentare des ursprünglichen Autors (Zeilen 216/217, zur Herleitung
von `BemD` und `vaeC`) sind bewusst **auf Deutsch belassen** — sie dokumentieren dessen
Modellannahmen und sind nicht nutzersichtbar.

### Wurde funktionale Logik angefasst?

**Nein — maschinell nachgewiesen.**

```
verglichene Felder:                 72
nur Text-/Beschriftungsunterschied: 18
echte Zahlabweichungen:              0
```

Verglichen wurden die Vier-Strukturen-Tabelle, sämtliche Kennzahlenblöcke der
Abschnitte B, C, D und F, die Beschriftungen der Fristen-Grafik und die
Prüfungskaskade.

Ein erster Durchlauf meldete eine vermeintliche Abweichung in der Kaskade. Ursache war
allein die geänderte Zitierweise: „Abs. 1, 2" liefert beim Zerlegen das Token `1,`,
„(1), (2)" dagegen `1`. Nach Normalisierung der Satzzeichen: null Abweichungen. Die
inhaltlichen Werte (50 %, 100 %) stimmen in beiden Fassungen überein.

### Einbettung in Framer

Wie Modul 1, mit `tool:'german-tax-layer'` in beiden Nachrichten.

### Offene Punkte zur Prüfung durch den Eigentümer

- Der Abschnitt „Legal position" nennt einen Rechtsstand „as at August 2026" sowie
  Sätze von 47,475 % und 15,825 % — unverändert aus dem Original, von mir nicht geprüft.
- Die englische Wiedergabe deutscher Steuerterminologie (u. a. „CFC taxation" für
  Hinzurechnungsbesteuerung, „extended limited tax liability" für erweitert beschränkte
  Steuerpflicht) ist fachlich gegenzulesen.
- Der Absatz „Deviations from the underlying Excel file" beschreibt vier Festwert-Zellen
  in der Quell-Excel. Das ist eine Aussage des ursprünglichen Autors über eine Datei,
  die mir nicht vorliegt — inhaltlich ungeprüft übernommen.

## 3. `/tools/development-off-plan` — fertig

**Originaldatei:** `~/Desktop/bhatti-cleveland_second_layer/modul-development.html`
**Zieldatei:** `development-off-plan.html`

Inhalt: Development Spread (Yield on Cost gegen Exit-Cap-Rate), Kosten- und
Kapitalaufbau, Projektqualität mit Profit on Cost, Rendite und Gewinnverteilung nach
vereinfachtem europäischem Wasserfall, jährliche Eigenkapital-Cashflows.

### Vorgenommene Änderungen

Identisches Muster wie Module 1 und 2. Zusätzlich modulspezifisch:

| Änderung | Art |
|---|---|
| Zahlenformat-Suffixe `Mrd.` / `Mio.` / `Tsd.` → `bn` / `m` / `k` | rein visuell; Ziffern unverändert |
| Tabellenkopf „Tsd. AED" → „k AED" | rein visuell |

### Wurde funktionale Logik angefasst?

**Nein — maschinell nachgewiesen.**

```
verglichene Felder:                 190
nur Text-/Beschriftungsunterschied:  29
echte Zahlabweichungen:               0
```

Verglichen wurden alle drei Kennzahlenblöcke, die vollständige Jahresrechnung
(elf Jahresspalten × elf Zeilen), beide Bewertungsblöcke sowie sämtliche
Beschriftungen der Spread- und Cashflow-Grafik.

### Einbettung in Framer

Wie Modul 1, mit `tool:'development-off-plan'` in beiden Nachrichten.

### Anmerkung zur Prüfmethode

Bei diesem Modul ist ein Fehler in meinem Ersetzungsskript aufgefallen: Die Kontrolle,
ob alle Suchmuster gefunden wurden, lief **vor** dem Ersetzen. Dadurch blieb unbemerkt,
dass die Ersetzung „Exit-Cap-Rate" → „Exit cap rate" weiter oben bereits in die
Methodik-Fußnote hineingegriffen hatte, sodass deren eigenes, längeres Suchmuster
anschließend nicht mehr passte — die Fußnote blieb deutsch.

Aufgefallen ist das durch die nachgelagerte Umlaut-Zählung, nicht durch die
Ersetzungsprüfung. Der Absatz wurde nachgezogen. Für Modul 4 wird die Prüfung
während des Ersetzens durchgeführt.

**Konsequenz für Module 1 und 2:** dort war die Umlaut-Zählung am Ende bei 0 bzw. bei
genau den zwei bewusst belassenen Code-Kommentaren — beide Module sind davon also nicht
betroffen.

### Offene Punkte zur Prüfung durch den Eigentümer

- Der Absatz „Reference values" nennt Schwellen von 150 Basispunkten und 15 % Profit on
  Cost als institutionelle Maßstäbe — unverändert aus dem Original, von mir nicht geprüft.

### Genehmigte Änderung an einer Rechengrundlage: Wechselkurs

Das Original rechnete mit **4,20 AED je EUR**, die Module 1 und 2 mit **4,2769**. Auf
ausdrückliche Freigabe des Eigentümers (30.09.2026) wurde auf den einheitlichen Kurs
**4,2769** vereinheitlicht — geändert wurde ausschließlich Modul 3.

Geändert:

```
const FX=4.2;   →   const FX=4.2769;
Fußnote „Conversion at 4.20 AED per EUR." → „… 4.2769 AED per EUR."
```

Nachweis in zwei Richtungen:

```
AED-Ansicht, 146 Felder:   0 Unterschiede
EUR-Ansicht, 55 Beträge:   0 Abweichungen vom erwarteten Verhältnis 4,20 / 4,2769
```

Die AED-Ansicht bleibt unberührt, weil der Kurs dort rechnerisch nicht einfließt
(`cur==='EUR' ? x/FX : x`). In der EUR-Ansicht verschieben sich alle Beträge exakt um
das Kursverhältnis, Stichprobe 67,7 → 66,5 Mio. EUR.

**Dies ist die einzige bisher vorgenommene Änderung an einer Rechengrundlage in allen
drei Modulen.**

## 4. `/tools/real-estate-returns` — fertig

**Originaldatei:** `~/Desktop/bhatti-cleveland_second_layer/index.html`
**Zieldatei:** `real-estate-returns.html`

Inhalt: NOI, Cash-on-Cash, DSCR und Nachsteuer-Rendite; Steuerbrücke Jahr 1 zwischen
VAE- und deutscher Ebene für drei Halteformen; Fünfjahres-Cashflow mit Diagramm;
Gesamtinvestition, IRR, Kapitalrückfluss und Break-even-Auslastung.

### Vorgenommene Änderungen

Dieses Modul brauchte vier Eingriffe, die die anderen drei nicht brauchten:

| Änderung | Art |
|---|---|
| Aus dem Embed-Schnipsel ein gültiges HTML-Dokument gemacht: `<!DOCTYPE>`, `<html lang="en">`, `<head>`, `<body>`, Viewport-Meta, `<title>` | strukturell |
| Verirrtes `</a>` in Zeile 10 entfernt | strukturell, Fehler im Original |
| BLACK-PEARL-Farbüberlagerung als eigener `<style>`-Block über der vorkompilierten Tailwind-Schicht | rein visuell |
| Fehlende Höhen-Nachricht per Integrationsschicht ergänzt | additiv |
| Calendly-Konstante entfernt, `<a id="cta">` zu `<button id="cta">` umgebaut | funktional, siehe unten |
| Querverweis auf `modul-development.html` entfernt | funktional |
| Sämtliche Beschriftungen, Fußnoten und Strukturhinweise ins Englische übersetzt | redaktionell |

**Zur Farbüberlagerung:** Die vorkompilierte Tailwind-Schicht (17,7 KB) bleibt
unangetastet. Stattdessen liegt darüber ein Block, der ausschließlich Farben, die
Überschriftenschrift und Eckenradien überschreibt — rund 45 Regeln, alle unter
`#dxb-widget` gescoped. Entfernt man diesen Block, erscheint wieder die ursprüngliche
Navy-Optik. Das dunkle Thema des Moduls bleibt funktionsfähig und wurde von Navy auf
`#0B0B0B` abgebildet.

### Wurde funktionale Logik angefasst?

**Nein — maschinell nachgewiesen.**

```
Jahresrechnung (#cf-table u. a.), 50 Felder:   0 Unterschiede
alle reinen Zahlenfelder im Widget, 83 Felder: 2 Unterschiede
```

Die zwei Abweichungen sind die statischen Regler-Endbeschriftungen „300 Tsd." → „300k"
und „15 Mio." → „15m". **Kein berechneter Wert weicht ab.**

### Einbettung in Framer

Wie Modul 1, mit `tool:'real-estate-returns'`. Zusätzlich reagiert die
Integrationsschicht hier auch auf `change`, weil das Modul Auswahlfelder
(Halteform-Umschalter) nutzt.

### Fehlgriff bei der Prüfung — und Rücknahme

Ich hatte zunächst diagnostiziert, die äußere Grundfläche schalte im dunklen Thema nicht
um, und dafür eine Korrekturregel eingefügt. **Diese Diagnose war falsch.**

Ursache des Irrtums: Die Browser-Ansicht war ausgeblendet. Ohne Darstellung laufen
CSS-Überblendungen nicht, und `background-color` hat hier eine Überblendung von 0,3 s.
`getComputedStyle` lieferte deshalb den zuletzt gezeichneten statt den gültigen Wert —
so stark, dass selbst ein Inline-Stil und `!important` scheinbar wirkungslos blieben.
Das war das Signal, dass nicht die Kaskade defekt war, sondern meine Messung.

Ein Bildschirmfoto erzwingt die Darstellung und zeigte: Das dunkle Thema funktioniert
einwandfrei. Die eingefügte Regel wurde wieder **entfernt**; die Datei enthält sie nicht.

**Lehre für künftige Prüfungen:** Eigenschaften mit CSS-Überblendung nicht per
`getComputedStyle` messen, solange die Ansicht ausgeblendet ist. Zahlenwerte im Text
sind davon nicht betroffen — alle Rechenprüfungen der vier Module bleiben gültig.

### Genehmigte Änderung an einer Rechengrundlage: Wechselkurs

Wie Modul 3. Hier steht der Kurs nicht als `const FX`, sondern als Modellparameter:

```
fx: 4.2,   →   fx: 4.2769,
Schlusszeile „EUR/AED conversion at 4.20" → „… at 4.2769"
```

Nachweis: 40 Beträge in der EUR-Ansicht geprüft, 0 Abweichungen vom erwarteten
Verhältnis. Stichprobe 132.000 AED ÷ 4,2769 = 30.863 EUR. Die AED-Ansicht ist
unberührt, weil der Kurs dort nicht einfließt (`CUR === 'EUR' ? v / P.fx : v`).

Damit rechnen **alle vier Module** mit 4,2769.

### Offene Punkte zur Prüfung durch den Eigentümer

- Die Fußnoten nennen konkrete Erwerbsnebenkosten (DLD-Transfer 4 %, Trustee AED 4.200
  usw.) und Rechtsstände — unverändert aus dem Original übernommen, von mir nicht geprüft.
- Die englische Wiedergabe der Strukturhinweise und Rechtsfolgen ist fachlich
  gegenzulesen.
- Das Modul behält seinen eigenen Hell-/Dunkel-Umschalter. Ob die Tools in Framer
  überhaupt einen eigenen Themenschalter haben sollen, ist zu entscheiden.

---

## Ursprüngliche Einschätzung zu Modul 4 (zur Nachvollziehbarkeit)

**Vorgesehene Originaldatei:** `index.html` (76 KB, lauffähig)

Weicht als einziges Modul strukturell ab und braucht mehr als einen Token-Tausch:

- Es ist **kein vollständiges HTML-Dokument** — `<!DOCTYPE>`, `<html>`, `<head>` und
  `<body>` fehlen, in Zeile 10 steht ein verirrtes `</a>`. Für den Einsatz als iframe
  muss daraus ein sauberes Dokument werden.
- Es bringt eine **eigene, vorkompilierte Tailwind-Schicht** mit Navy-Palette und einen
  eigenen Dark-Mode-Umschalter. Diese Schicht muss auf die BLACK-PEARL-Tokens
  abgebildet werden, ohne die Markup-Struktur zu zerlegen.
- Es sendet **keine Höhen-Nachricht** an das übergeordnete Fenster; die
  Integrationsschicht muss ergänzt werden.
- Es enthält ebenfalls den Calendly-Link (`CALENDLY_URL`, Zeile 382), der zu entfernen ist.

---

## Lokale Vorschau

```bash
cd ~/Desktop/blackpearl-tools && python3 -m http.server 8777
```

Dann `http://localhost:8777/uae-corporate-tax.html` aufrufen.
