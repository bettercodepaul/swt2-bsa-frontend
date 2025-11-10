# Analytics – Ligaübersicht

Ziel: Basis-Instrumentierung zur Messung von Nutzung und Performance der Ligaübersicht.

- Transparenz über Nutzung und Ladezeiten
- Datenbasierte Entscheidungen und Monitoring von Metrikzielen

Feature-Flag / Konfiguration
- ENV: `environment.analytics`
  - `enabled`: boolean – aktiviert/deaktiviert Analytics (Default: prod=true, dev=false)
  - `provider`: "matomo" | "console" | "none" (Default: prod=matomo, dev=console)
- Fallbacks: Bei fehlender Konfiguration oder im Dev-Modus wird auf Console geloggt; ansonsten No-Op.

Event-Taxonomie (nur Ligaübersicht)
- nav_ligauebersicht_click
  - Ort: Sidebar (nur wenn Route == "/liga")
  - Payload: `{ origin: "sidebar", route: string }`
- tree_expand
  - Ort: TreeComponent (Toggle Expand/Collapse)
  - Payload: `{ nodeId: number, expanded: boolean, level: number|null }`
- tree_select
  - Ort: TreeComponent (Select via Klick/Tastatur)
  - Payload: `{ nodeId: number }`
- api_liga_hierarchie_timing
  - Ort: LigaOverviewComponent (fetch-start → render)
  - Payload: `{ durationMs: number, p95Ms: number, samples: number, status: "ok"|"empty"|"timeout"|"offline-fallback"|"error" }`

Messmethode Performance
- Startpunkt: vor `LeagueHierarchyService.getHierarchy()`
- Endpunkt: nach Render der Tree-Daten (microtask nach DOM-Update)
- P95: Rolling-Berechnung clientseitig über die letzten 1000 Samples; wird mitgeloggt und angezeigt.

Implementierungsdetails
- Service: `AnalyticsService` (leichter Wrapper)
  - `track(event, payload?)`
  - `startTimer(name)` → stop()-Funktion
  - `trackTiming(event, durationMs, extra?)` inkl. P95-Berechnung
- Integration
  - Sidebar → `nav_ligauebersicht_click`
  - TreeComponent → `tree_expand`, `tree_select`
  - LigaOverviewComponent → `api_liga_hierarchie_timing`

Auswertung
- Matomo/Piwik: Events werden via `_paq.push(['trackEvent', 'Ligauebersicht', <event>, <payload>])` gesendet.
- Console: Dev-Fallback, inkl. P95-Logging (z. B. `[Analytics:P95] api_liga_hierarchie_timing p95=123ms (n=57)`).
