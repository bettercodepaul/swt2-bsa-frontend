# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-10] - ANALYTICS-001 Basis-Instrumentierung Ligaübersicht

### Hinzugefügt
- Analytics-Wrapper `AnalyticsService` (leichtgewichtig, sichere Fallbacks):
  - `track(event, payload?)`
  - `startTimer(name)` → Stop-Funktion
  - `trackTiming(event, durationMs, extra?)` inkl. P95-Berechnung (Rolling, n=1000)
- Feature-Flag/ENV (`environment.analytics`):
  - Dev: `enabled=false`, `provider='console'` (Console-Logging)
  - Prod: `enabled=true`, `provider='matomo'` (Matomo, Fallback: Console/No-Op)
- Event-Taxonomie (nur Ligaübersicht):
  - `nav_ligauebersicht_click` (Sidebar, nur bei Route "/liga")
  - `tree_expand` (Expand/Collapse inkl. `nodeId`, `expanded`, `level`)
  - `tree_select` (Selection inkl. `nodeId`)
  - `api_liga_hierarchie_timing` (Fetch → Render; Payload: `durationMs`, `p95Ms`, `samples`, `status`)
- Doku: `bogenliga/docs/analytics/analytics-ligauebersicht.md` mit Taxonomie, Messmethode, Flag

### Geändert
- `sidebar.component.ts`: Tracking von `nav_ligauebersicht_click` auf Analytics-Wrapper umgestellt
- `tree.component.ts`: Tracking von `tree_expand` und `tree_select` integriert
- `liga-overview.component.ts`: Clientseitige Messung Fetch→Render und Versand von `api_liga_hierarchie_timing`; Seitenaufruf-Tracking entfernt (Fokus auf geforderte Events)
- `shared.module.ts`: `AnalyticsService` als Provider registriert; Barrel-Export ergänzt
- `environment.*.ts`: Analytics-Flag/Provider ergänzt

### Technische Details
- Commit: wird nach Merge gesetzt
- Autor: Ihr Team
- Datum: 2025-11-10
- Dateien neu/geändert (Auswahl):
  - Neu: `src/app/modules/shared/services/analytics/analytics.service.ts`
  - Neu: `src/app/modules/shared/services/analytics/index.ts`
  - Neu: `bogenliga/docs/analytics/analytics-ligauebersicht.md`
  - Geändert: `src/app/modules/shared/services/index.ts`
  - Geändert: `src/app/modules/shared/shared.module.ts`
  - Geändert: `src/app/components/sidebar/sidebar.component.ts`
  - Geändert: `src/app/modules/liga-overview/components/tree/tree.component.ts`
  - Geändert: `src/app/modules/liga-overview/components/liga-overview/liga-overview.component.ts`
  - Geändert: `src/environments/environment.ts|dev.ts|prod.ts`

### Tests / Verifikation
- Manuelle Verifikation (Dev):
  - Sidebar Klick auf „Ligaübersicht“ → Console: `[Analytics] nav_ligauebersicht_click ...`
  - Tree Expand/Collapse/Select → Console: entsprechende Events
  - Laden der Hierarchie → Console: `[Analytics:P95] api_liga_hierarchie_timing p95=…ms (n=…)`
- Hinweis: Matomo-Transport erfolgt nur, wenn `_paq` vorhanden ist und `environment.analytics.enabled=true`.

### Abhängigkeiten
- NAV-001, API-001, UI-001
