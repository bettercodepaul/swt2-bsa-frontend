# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-10] - FE-ANALYTICS-LIGAUEBERSICHT Basis-Instrumentierung

### Hinzugefügt
- AnalyticsService (Shared):
  - API: `track(event, payload?)`, `mark(name)`, `measureAndTrack(event, startMark, endMark, payload?)`
  - Transport: `auto` (Matomo `_paq` falls vorhanden) oder `console` (Fallback)
  - Clientseitiges P95 über Gleitfenster (letzte ~200 Messungen)
- Ligaübersicht (Scope dieses Tickets):
  - `tree_expand` bei Expand/Collapse in `TreeComponent` mit Payload `{ nodeId, state, level }`
  - `tree_select` bei Selektion in `LigaOverviewComponent` mit Payload `{ nodeId }`
  - `api_liga_hierarchie_timing` (Fetch→Render) via Performance API (`requestAnimationFrame`) inkl. `{ durationMs, p95Ms?, status }`
- ENV Feature-Flag `environment.analytics` (enabled/transport) für Dev/Prod/Offline
- Doku: `docs/analytics-ligauebersicht.md` mit Event-Taxonomie und Konfiguration

### Geändert
- `LigaOverviewComponent`: Entfernt ehemaliges page-view-Tracking; Events nur gemäß Taxonomie des Tickets.

### Technische Details
- Commit: wird nach Merge gesetzt
- Autor: Moritz Feucht
- Datum: 2025-11-10
- Dateien geändert: `analytics.service.ts`, `liga-overview.component.ts`, `tree.component.ts`, Environments, Doku

### Tests / Verifikation
- Manuell (Dev, Console-Fallback):
  - Expand/Collapse im Baum → `[analytics] tree_expand` in Console mit korrektem Payload
  - Knoten selektieren → `[analytics] tree_select`
  - Seitenaufruf/Reload → `[analytics] api_liga_hierarchie_timing` mit `durationMs` und `p95Ms`
- Matomo (falls konfiguriert):
  - Kategorie „App“, Action = Eventname, Name = JSON-Payload


