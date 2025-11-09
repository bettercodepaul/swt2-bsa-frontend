# Liga-Hierarchie API-Contract

Ziel: Konsistenter, klar typisierter Zugriff auf Liga-Hierarchiedaten.

Basis-URL
- Aus Environment: `environment.backendBaseUrl`
  - Dev: `http://localhost:9000`
  - Prod: `https://liga.bsapp.de/api`

Endpoints (v1)
- GET `/v1/liga`
  - Beschreibung: Liefert eine flache Liste aller Ligen. Die Hierarchie wird über `ligaUebergeordnetId` rekonstruiert (null = Root).
  - Auth: JWT (global registrierter JwtInterceptor)
  - Response 200 (application/json):
    - Array von Objekten mit Feldern (vereinfachtes Schema):
      - `id: number`
      - `name: string`
      - `ligaUebergeordnetId?: number | null`
      - `regionId?: number | null`
      - `version?: number`
  - Response 4xx/5xx: Fehlerobjekt; UI bekommt Status-Mapping durch Service (siehe unten).

- GET `/v1/liga/{id}`
  - Beschreibung: Detail einer Liga (für Drill-Down oder Lazy-Loading einzelner Pfade).

- GET `/v1/liga/lowest/{id}`
  - Beschreibung: Liefert die unterste Liga im Pfad (Validierung/Leaf-Ermittlung).

Versionierung
- Pfad-basiert (`/v1/...`). Weitere Versionen werden über neue Pfade eingeführt.

Caching
- Serverseitig empfohlene Header (optional): `Cache-Control`, `ETag`.
- Clientseitig: Der LeagueHierarchyService liest keine ETags, kann aber problemlos erweitert werden.

Service-Verhalten (LeagueHierarchyService)
- Quelle: `GET /v1/liga`
- Timeout: 6000 ms (konfigurierbar über Options)
- Fehlerbehandlung: HTTP-Fehler und Timeouts werden gemappt.
- Fallback: Lokale Mockdaten `assets/mocks/league-hierarchy.json` werden bei Fehlern geladen.
- Status-Mapping (UI-freundlich):
  - `ok`: Erfolgreich, Daten vorhanden
  - `empty`: 200 aber leere Liste
  - `timeout`: Zeitüberschreitung
  - `error`: HTTP-Fehler (4xx/5xx)
  - `offline-fallback`: Mockdaten wurden genutzt

Response-Typen (Frontend)
- API-DTO: `LeagueDTO` (`src/app/modules/shared/models/league.dto.ts`)
- UI-Baum: `LeagueTreeNode` (`src/app/modules/shared/models/tree-node.ts`)
- Ergebnis: `LeagueHierarchyResult` (Status + Baum)

Mockdaten
- Datei: `src/assets/mocks/league-hierarchy.json`
- Format: Flache Liste im `LeagueDTO`-Format; der Service baut daraus den Baum.
