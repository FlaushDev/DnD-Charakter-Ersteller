# Tools n' Trinkets — Der deutsche D&D Charakter-Ersteller

> Ein kostenloses, registrierungsfreies Tool für deutschsprachige D&D-Spieler.  
> Erstelle deinen Charakter schnell und regelkonform – ohne Ablenkung, direkt im Browser.

**Live:** [tools-n-trinkets.at](https://tools-n-trinkets.at)  
**Status:** Alpha — das Projekt befindet sich aktiv in Entwicklung.

---

## Features

| Feature | Status |
|---|---|
| Charakter-Ersteller (D&D 5e 2014) | Verfügbar |
| Charakter-Ersteller (D&D 5.5e 2024) | In Entwicklung |
| PDF-Export (Charakterbogen ausfüllen) | Verfügbar |
| Online-Würfel (W2 bis W1.000.000) | Verfügbar |
| Karten-Tool (Grid auf Maps legen) | Geplant |
| Tageszeit-Tracker | Geplant |
| Encounter-Tracker mit Mobliste | Geplant |
---

## Projektstruktur

```
/
├── homepage.html               # Startseite
├── charakter-ersteller.html    # Charakter-Ersteller 2014
├── charakter-ersteller-2024.html  # Charakter-Ersteller 2024 (WIP)
├── wuerfel.html                # Online-Würfel
├── impressum.html              # Impressum & Rechtliches
├── zauber.html                 # Zauberkarten-Generator
├── main-script.js              # Seiten-Skript: 2014-Ersteller, Würfel, E-Mail-Kopie
├── side-script.js              # Seiten-Skript: 2024-Ersteller
├── charakter-logik.js          # Gemeinsame Charakter-Logik (von main-/side-script.js benutzt)
├── pdf.js                      # PDF-Export Modul (pdf-lib)
├── data.js                     # Spieldaten 2014 (Klassen, Völker, etc.)
├── data2024.js                 # Spieldaten 2024 (Klassen, Völker, etc.)
├── zauber-script.js            # Logik für den Zauberkarten-Generator
├── spells.json                 # SRD-Zauberdaten (Deutsch) für zauber.html
├── style.css                   # Globales Stylesheet (ganze Seite)
└── charakterbogen.pdf          # Leerer Charakterbogen (Pflichtdatei für PDF-Export)
```

Die 2014er- und 2024er-Charakter-Ersteller teilen sich seit Kurzem ihre
komplette Logik über `charakter-logik.js` — vorher gab es sie zweimal
(einmal in `main-script.js`, einmal in `side-script.js`), was auf Dauer
eine Bug-Quelle war. `main-script.js`/`side-script.js` füttern die
gemeinsame Logik nur noch mit ihren jeweiligen Spieldaten und kümmern
sich um alles, was wirklich seitenspezifisch ist (Würfel, Toasts, …).

---

## Lokale Installation

Das Projekt benötigt keinen Build-Schritt. Da ES-Module (`import`/`export`) verwendet werden, muss die Seite jedoch über einen lokalen Webserver geöffnet werden – einfaches Öffnen als Datei (`file://`) funktioniert nicht.

**VS Code Live Server:**
1. Erweiterung [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) installieren
2. `homepage.html` öffnen → rechtsklick → *Open with Live Server*

> ⚠️ Die Datei `charakterbogen.pdf` muss im Root-Verzeichnis liegen, damit der PDF-Export funktioniert.

---

## Technologien

- **Vanilla JavaScript** (ES Modules) — keine Frameworks
- **Bootstrap 5** — Layout & responsive Design
- **pdf-lib** — PDF-Formularfelder befüllen und exportieren
- **Toastify.js** — Benachrichtigungen
- **Font Awesome** — Icons

---

## Mitmachen / Feedback

Fehler gefunden oder einen Verbesserungsvorschlag?

- **GitHub Issue** öffnen: [github.com/FlaushDev/DnD-Charakter-Ersteller](https://github.com/FlaushDev/DnD-Charakter-Ersteller)
- **Mail:** owner@tools-n-trinkets.at

Pull Requests sind herzlich willkommen!

---

## Rechtliches

DnD 5e Charakter-Creator ist ein **inoffizieller Fan-Inhalt** im Rahmen der Richtlinie für Fan-Inhalte von Wizards of the Coast.  
Nicht von Wizards gefördert oder gesponsert. Bestandteile des enthaltenen Materials sind Eigentum von Wizards of the Coast. ©Wizards of the Coast LLC.

---

<sub>Erstellt von Paul S. | Alle Rechte vorbehalten © 2025</sub>