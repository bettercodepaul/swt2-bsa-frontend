# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-01] - Ligaübersicht Modul

### Hinzugefügt
- **Neues Modul "Ligaübersicht"**: Vollständiges Angular-Modul für die zentrale Ligaübersicht
  - Neue Route `/liga` im App-Routing hinzugefügt
  - `LigaOverviewComponent` mit Platzhalter-UI implementiert
  - Modul-Struktur mit Routing, Komponente, Styles und Unit Tests
  
- **Navigation**: 
  - Neuer Menüpunkt "Ligaübersicht" in der Sidebar (Online- und Offline-Modus)
  - Icon `faChartBar` für den Menüpunkt
  - Berechtigung: `CAN_READ_DEFAULT`
  
- **Analytics-Integration**:
  - Tracking für Navigationsklicks (`nav_ligauebersicht_click`)
  - Tracking für Seitenaufrufe (`page_ligauebersicht_view`)
  - Integration mit Matomo/Piwik über `window._paq`
  
- **Internationalisierung**:
  - Neue Übersetzungen in `de.json`:
    - `SIDEBAR.LIGAUEBERSICHT`: "Ligaübersicht"
    - `LIGAUEBERSICHT.TITLE`: "Ligaübersicht"
    - `LIGAUEBERSICHT.DESCRIPTION`: "Hier finden Sie eine zentrale Übersicht aller Ligen mit ihren hierarchischen Strukturen."
    - `LIGAUEBERSICHT.PLACEHOLDER`: "Die Ligaübersicht befindet sich derzeit in der Entwicklung. Datenintegration erfolgt in Kürze."
  
- **Unit Tests**:
  - Vollständige Test-Suite für `LigaOverviewComponent`
  - Tests für Komponenten-Initialisierung
  - Tests für Analytics-Event-Tracking
  - Tests für Fehlerbehandlung bei fehlendem Analytics-Service

### Geändert
- `app.routing.ts`: Neue Route `/liga` hinzugefügt
- `sidebar.config.ts`: Menüpunkt für Ligaübersicht in beiden Konfigurationen (Online/Offline) hinzugefügt
- `sidebar.component.ts`: Neue Methode `trackNavigationClick()` für Analytics-Tracking

### Technische Details
- **Commit**: `411c71a94`
- **Autor**: Joshua Jeglinski
- **Datum**: 2025-11-01 13:57:02 +0100
- **Dateien geändert**: 11 Dateien (248 Zeilen hinzugefügt)
  - 4 Dateien modifiziert
  - 7 neue Dateien erstellt

### Vorbereitungen für zukünftige Features
- Platzhalter-Struktur für zukünftige Baumstruktur-Implementierung vorbereitet
- Modul-Struktur ermöglicht einfache Integration von Services und Data-Providern

