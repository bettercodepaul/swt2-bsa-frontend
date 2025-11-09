# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-09] - UI-001 Basis-Baumkomponente

### Hinzugefügt
- **Liga-Hierarchie Tree**:
  - Neue Komponenten `TreeComponent` und `TreeNodeComponent` mit ARIA-konformem Markup (`tree`, `treeitem`, `group`)
  - Expand-/Collapse-State über `Set` mit Initial-Expansion und Fokusverwaltung (Roving Tabindex)
  - Tastaturnavigation (Pfeile, Enter, Space) inklusive Fokus- und Selection-Handling
  - Klick- und Tastatur-Selection feuern `select(ligaId)`-Output
- **UI & Styles**:
  - Horizontale Baumstruktur mit flexiblen Slots, responsivem Layout und Verbindungslinien zwischen allen Knoten
  - Karten-Design mit Level-basierten Farbthemen, Schatten, Hover-/Fokus-States und 44 px-Touch-Zielen
  - Adaptive CSS-Variablen zur einfachen Farb- und Spacing-Anpassung
- **Ligaübersicht**:
  - Einbindung des Trees in `LigaOverviewComponent` inkl. Statusanzeige (Loading, Empty, Timeout, Offline-Fallback, Error)
  - Analytics-Tracking für Tree-Selektionen (`tree_ligauebersicht_select`)
- **Internationalisierung**:
  - Neue Übersetzungen für Tree-Labels und Statusmeldungen (`de.json`, `en.json`)
- **Tests**:
  - Unit-Tests für den Tree (Expand/Collapse, Keyboard, Selection)
  - Erweiterte Tests für `LigaOverviewComponent` (Datenhydrierung, Statusabbildung)

### Geändert
- `liga-overview.component.html|scss|ts`: Platzhalter entfernt, Tree integriert, Status-Handling ergänzt
- `liga-overview.module.ts` und Barrel-Exports aktualisiert
- `tree.component.html|scss`, `tree-node.component.html|ts|scss`: Struktur-Refactor für horizontales Layout, Verbindungslinien und responsive Slots

### Technische Details
- **Commit**: wird nach Merge gesetzt
- **Autor**: Joshua Jeglinski
- **Datum**: 2025-11-09
- **Dateien geändert**: 18 Dateien (neu/aktualisiert)

### Tests
- `npm run test -- --watch=false --include='src/app/modules/liga-overview/components/tree/tree.component.spec.ts'`
  - ❗️Fehlgeschlagen aufgrund `error:0308010C:digital envelope routines::unsupported` (Node/OpenSSL-Konflikt). Testcode kompiliert lokal; Build muss in CI mit passender Node/OpenSSL-Version ausgeführt werden.
- Manuelle Verifikation: Browser-Check (Desktop) inkl. Expand/Collapse, Hover/Fokus, Tastaturnavigation

### Offene Punkte
- Datenquelle `DATA-001` liefert aktuell Mock-/Fallback-Daten – Integration der realen API bleibt offen.
- Virtualisierung der Tree-Ansicht ist vorbereitet und wird in späteren Sprints aktiviert.


