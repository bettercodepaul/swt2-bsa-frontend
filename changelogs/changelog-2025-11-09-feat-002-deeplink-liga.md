# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-09] - FEAT-002 Deeplink Liga

### Hinzugefügt
- **Deeplink-Funktionalität**:
  - Query-Parameter `ligaId` wird in der Liga-Übersicht unterstützt
  - Aufruf `/liga?ligaId=X` expandiert und markiert automatisch den entsprechenden Knoten im Baum
  - Pfad-Erkennung und automatisches Expandieren aller Eltern-Knoten
- **Navigation zur Liga-Homepage**:
  - Tree-Selektion navigiert zur Liga-Homepage mit korrekter URL-Integration
  - Zentrale Helper-Funktion `buildLeagueUrl(ligaId)` für konsistente URL-Generierung
  - Konfiguriererbarer Base-Path (`/wettkaempfe/ligatabelle`)
- **Fehlerbehandlung**:
  - Nicht-blockierende Hinweismeldungen für ungültige Liga-IDs
  - Nicht-blockierende Hinweismeldungen für nicht existierende Liga-IDs
  - Automatisches Ausblenden der Fehlermeldungen nach 5 Sekunden
  - Guard-Validierung mit `isValidLigaId()`-Helper
- **TreeComponent Erweiterungen**:
  - Neue Methode `expandPathTo(nodeId)` für programmatisches Expandieren
  - Rekursive Pfad-Ermittlung bis zur Wurzel
  - Automatische Selektion und Fokussierung des Zielknotens
- **Internationalisierung**:
  - Neue Übersetzungen für Deeplink-Fehlermeldungen in `de.json` und `en.json`
  - `LIGAUEBERSICHT.DEEPLINK.INVALID_ID` (ungültige Liga-ID)
  - `LIGAUEBERSICHT.DEEPLINK.NOT_FOUND` (Liga nicht gefunden)
- **Tests**:
  - Unit-Tests für `league-url.helper.ts` (buildLeagueUrl, isValidLigaId)
  - Erweiterte Tests für `LigaOverviewComponent` mit Deeplink-Szenarien
  - Test für gültige ligaId-Parameter
  - Test für ungültige ligaId-Parameter
  - Test für nicht existierende ligaId
  - Test für Navigation zur Liga-Homepage
  - Test für automatisches Ausblenden von Fehlermeldungen

### Geändert
- `liga-overview.component.ts`: 
  - `ActivatedRoute` für Query-Parameter-Handling integriert
  - `ViewChild`-Referenz zur TreeComponent hinzugefügt
  - `onTreeSelect()` erweitert um Navigation zur Liga-Homepage
  - Neue private Methoden: `handleDeeplink()`, `waitForDataThenExpand()`, `expandToNode()`, `navigateToLeagueHomepage()`, `showDeeplinkError()`
- `liga-overview.component.html`: Deeplink-Fehlermeldungs-Alert hinzugefügt
- `tree.component.ts`: Neue öffentliche Methode `expandPathTo()` für programmatisches Expandieren
- `liga-overview.component.spec.ts`: Erweitert um Deeplink-Test-Suite mit ActivatedRoute-Mock

### Technische Details
- **Commit**: wird nach Merge gesetzt
- **Autor**: Meinhard Holzknecht
- **Datum**: 2025-11-09
- **Dateien geändert/neu**:
  - Neu: `bogenliga/src/app/modules/liga-overview/utils/league-url.helper.ts`
  - Neu: `bogenliga/src/app/modules/liga-overview/utils/league-url.helper.spec.ts`
  - Geändert: `bogenliga/src/app/modules/liga-overview/components/liga-overview/liga-overview.component.ts`
  - Geändert: `bogenliga/src/app/modules/liga-overview/components/liga-overview/liga-overview.component.html`
  - Geändert: `bogenliga/src/app/modules/liga-overview/components/liga-overview/liga-overview.component.spec.ts`
  - Geändert: `bogenliga/src/app/modules/liga-overview/components/tree/tree.component.ts`
  - Geändert: `bogenliga/src/assets/i18n/de.json`
  - Geändert: `bogenliga/src/assets/i18n/en.json`

### Tests
- Unit-Tests für `league-url.helper.ts`:
  -  `buildLeagueUrl()` erstellt korrekte URLs für gültige Liga-IDs
  -  `buildLeagueUrl()` wirft Fehler für ungültige Eingaben (null, undefined, negative Zahlen, NaN, Infinity)
  -  `isValidLigaId()` validiert korrekt positive Zahlen
  -  `isValidLigaId()` erkennt ungültige Eingaben (Strings, null, undefined, Objekte)
- Integrationstests für `LigaOverviewComponent`:
  -  Deeplink mit gültiger ligaId expandiert und markiert Knoten
  -  Ungültige ligaId zeigt Fehlermeldung an
  -  Nicht existierende ligaId zeigt Fehlermeldung an
  -  Tree-Selektion navigiert zur korrekten Liga-Homepage-URL
  -  Fehlermeldungen werden nach 5 Sekunden automatisch ausgeblendet
- Manuelle Verifikation: 
  - Browser-Test mit `/liga?ligaId=X`
  - Pfad-Expansion und Knoten-Markierung
  - Navigation zur Liga-Homepage bei Selektion

### Offene Punkte
- Ziel-URL-Definition (`/wettkaempfe/ligatabelle?ligaId=`) basiert auf Annahme – muss mit Backend-Team abgestimmt werden
- Performance-Optimierung für `waitForDataThenExpand()` könnte durch Observable-basierte Lösung ersetzt werden
- Analytics-Tracking für Deeplink-Events könnte hinzugefügt werden

### Abhängigkeiten
-  UI-001 (Tree-Komponente)
-  NAV-001 (Routing-Konfiguration)
-  Ziel-URL-Definition (muss abgestimmt werden)
