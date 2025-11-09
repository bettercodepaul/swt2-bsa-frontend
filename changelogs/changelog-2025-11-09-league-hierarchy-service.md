# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-09] - Liga-Hierarchie Service

### Hinzugefügt
- API-Contract-Dokumentation für Liga-Hierarchie
  - `bogenliga/docs/api/league-hierarchy.md`
- Neuer `LeagueHierarchyService` mit Timeout, Fehler-/Leerdatenbehandlung, Status-Mapping und lokalem Mock-Fallback
  - `bogenliga/src/app/modules/shared/services/league-hierarchy/league-hierarchy.service.ts`
  - Export über Barrel: `bogenliga/src/app/modules/shared/services/index.ts`
- Streng typisierte Modelle/DTOs
  - `bogenliga/src/app/modules/shared/models/league.dto.ts`
  - `bogenliga/src/app/modules/shared/models/tree-node.ts`
- Lokale Mockdaten als Fallback
  - `bogenliga/src/assets/mocks/league-hierarchy.json`
- Unit-Tests (HttpClientTestingModule) inkl. 200/404/500/Timeout/Empty
  - `bogenliga/src/app/modules/shared/services/league-hierarchy/league-hierarchy.service.spec.ts`

### Geändert
- Export in `shared/services/index.ts` um `LeagueHierarchyService` ergänzt

### Technische Details
- Dateien geändert/neu:
  - Neu: `bogenliga/src/app/modules/shared/models/league.dto.ts`
  - Neu: `bogenliga/src/app/modules/shared/models/tree-node.ts`
  - Neu: `bogenliga/src/app/modules/shared/services/league-hierarchy/league-hierarchy.service.ts`
  - Neu: `bogenliga/src/app/modules/shared/services/league-hierarchy/league-hierarchy.service.spec.ts`
  - Neu: `bogenliga/src/assets/mocks/league-hierarchy.json`
  - Neu: `bogenliga/docs/api/league-hierarchy.md`
  - Geändert: `bogenliga/src/app/modules/shared/services/index.ts`
