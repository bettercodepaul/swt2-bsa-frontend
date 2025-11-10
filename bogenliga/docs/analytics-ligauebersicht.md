# Analytics: Ligaübersicht

Ziel: Basis-Instrumentierung zur Messung von Nutzung und Performance ausschließlich für die Ligaübersichtsseite.

Event-Taxonomie
- nav_ligauebersicht_click
  - Ort: Sidebar-Navigation (führt zur Route "/liga"). Hinweis: existiert bereits; außerhalb dieses Tickets nur referenziert.
  - Payload: none
- tree_expand
  - Ort: Ligaübersicht → Baum
  - Payload: { nodeId: number; state: 'expand'|'collapse'; level: number }
- tree_select
  - Ort: Ligaübersicht → Baum
  - Payload: { nodeId: number }
- api_liga_hierarchie_timing
  - Ort: Ligaübersicht → Datenladung (LeagueHierarchyService) bis Render des Baumes
  - Messung: Performance API, Markierungen
    - Start: api_liga_hierarchie_fetch_start (vor HTTP-Aufruf)
    - Ende: tree_render (im nächsten requestAnimationFrame nach Setzen der Daten)
  - Payload: { durationMs: number; p95Ms?: number; status?: 'ok'|'empty'|'error'|'timeout'|'offline-fallback' }

Implementierung
- Service: AnalyticsService (Shared)
  - API: track(event, payload?), mark(name), measureAndTrack(event, startMark, endMark, payload?)
  - Transport: auto (Matomo _paq, wenn vorhanden) oder console; via ENV toggelbar
  - P95: Clientseitige Approximation über Gleitfenster (letzte ~200 Messungen)
- LigaOverviewComponent
  - Entfernt generisches page_view-Tracking
  - track('tree_select', { nodeId }) bei Selektion
  - mark('api_liga_hierarchie_fetch_start') vor Laden; measureAndTrack('api_liga_hierarchie_timing', 'api_liga_hierarchie_fetch_start', 'tree_render', { status }) nach rAF
- TreeComponent
  - track('tree_expand', { nodeId, state, level }) bei Expand/Collapse

Konfiguration (Feature-Flag)
- environments:
  - environment.ts: analytics.enabled = true, transport = 'console'
  - environment.dev.ts/prod.ts: analytics.enabled = true, transport = 'auto'
  - environment.offline.ts: analytics.enabled = false

Auswertung
- Console (Dev): Sucht nach "[analytics]"-Prefix.
- Matomo/Piwik (Auto): Events erscheinen mit Kategorie "App"; Payload als JSON-String im "name"-Feld.



