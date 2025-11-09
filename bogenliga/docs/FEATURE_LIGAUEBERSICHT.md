# Feature: Ligaübersicht (Issue #1957-Frontend)

## Übersicht
Dieses Feature liefert eine vollständig interaktive Ligaübersicht mit einer barrierearmen Baumkomponente, angebundenem Routing, Datenlade- und Analytics-Integration.

## Implementierte Komponenten

### 1. Modulstruktur
**Pfad**: `src/app/modules/liga-overview/`

#### Dateien:
- `liga-overview.module.ts` – Angular-Modul für die Ligaübersicht
- `liga-overview.routing.ts` – Lazy-Loaded Route `/liga`
- `index.ts` – Barrel für Modul, Overview-Komponente und Tree-Komponente

#### Funktionsumfang:
- Lazy-Loaded Route `/liga` mit Menüeintrag in Sidebar (Online & Offline)
- Überblicksseite `LigaOverviewComponent` lädt Liga-Hierarchie via `LeagueHierarchyService`
- Statusanzeige inkl. Lade-, Leer-, Timeout-, Offline-Fallback- und Fehlerzustand
- Analytics-Events für Seitenaufruf (`page_ligauebersicht_view`) und Tree-Selektion (`tree_ligauebersicht_select`)

### 2. Tree-Komponenten
**Pfad**: `src/app/modules/liga-overview/components/tree/`

| Datei | Zweck |
| --- | --- |
| `tree.component.ts` / `.html` / `.scss` / `.spec.ts` | Container-Komponente, verwaltet Expand-Status, Tastatur-Fokus (Roving Tabindex) und ARIA-Rolle `tree` |
| `tree-node.component.ts` / `.html` / `.scss` | Präsentations-Komponente je Knoten, inkl. Verbindungslinien, Karten-Styles, ARIA-Attributen (`treeitem`, `aria-expanded`, `aria-selected`) |

#### Key-Features
- Expand-/Collapse über Set (`expandedIds`) mit Lazy-Updates und Fokus-Korrektur
- Tastaturnavigation: Pfeile Hoch/Runter/Links/Rechts, Enter/Space → Selection
- Roving Tabindex und Fokusmanagement inkl. `focusRequest`-Events für Pointer
- Verbindungslinien (Pseudo-Elemente) für vertikale und horizontale Branches
- Karten-Layout mit Level-basiertem Theming (konfigurierbar über CSS-Variablen)
- Responsives Flex-Layout: Slots mit `flex: 1 1 260px`, automatische Zeilenumbrüche ab 992 px
- Toggle-Buttons: 44 px Touch-Ziele, visuelle Indikatoren für expandierte Zustände

### 3. LigaOverviewComponent
**Dateien**: `components/liga-overview/liga-overview.component.*`

| Funktion | Beschreibung |
| --- | --- |
| Datenanbindung | `LeagueHierarchyService.getHierarchy()` inkl. Timeout-/Fallback-Handling |
| Statusanzeige | Spinner bei Ladezustand, Alerts bei `empty`, `timeout`, `offline-fallback`, `error` |
| Analytics | `trackPageView()` (Matomo `page_ligauebersicht_view`), `trackSelection()` (`tree_ligauebersicht_select`) |
| Integration | Tree-Component Binding (`[nodes]`, `(select)`) sowie ARIA-Beschriftung via `[attr.aria-label]` |

### 4. Routing & Navigation
- `app.routing.ts`: Lazy-Loaded Route `/liga`
- `sidebar.config.ts`: Menüpunkt mit `faChartBar`, Berechtigung `CAN_READ_DEFAULT`, DataCy-Selector
- `sidebar.component.ts`: `trackNavigationClick()` → `nav_ligauebersicht_click`

### 5. Internationalisierung (i18n)
- `src/assets/i18n/de.json` & `en.json`: Titel, Beschreibung, Statusmeldungen, Tree-Toggle (`EXPAND`/`COLLAPSE`)

### 6. Unit- und Integrationstests
- `tree.component.spec.ts`: Rendering, Expand/Collapse, Click-Selection, Keyboard-Navigation
- `liga-overview.component.spec.ts`: Datenhydrierung, Status-Mapping, Analytics-Events
- Tests laufen via `npm run test -- --include='src/app/modules/liga-overview/components/tree/tree.component.spec.ts'` (Hinweis: Node/OpenSSL 3 erfordert Legacy-Flag)

## Akzeptanzkriterien

### ✅ Erfüllt
1. **Eintrag "Ligaübersicht" sichtbar** – Sidebar-Eintrag mit Berechtigungsprüfung
2. **Navigation zu `/liga`** – Route lädt Modul lazy
3. **Interaktiver Tree** – Expand/Collapse, Tastaturnavigation, `select(ligaId)`-Event feuert
4. **Statuskommunikation** – Lade-/Fehlerzustände mit i18n-Alerts
5. **Analytics** – `nav_ligauebersicht_click`, `page_ligauebersicht_view`, `tree_ligauebersicht_select`

## Architektur & Gestaltung

### Accessibility
- ARIA-Rollen: `tree`, `treeitem`, `group`
- Roving Tabindex für Fokus (nur aktueller Eintrag `tabindex=0`)
- Sichtbarer Fokus-Ring, Tastaturbedienbarkeit garantiert

### Styling
- Kartenlayout mit CSS-Variablen (`--bla-tree-level-*`) für Farbcodierung je Hierarchie
- Verbindungslinien via `::before` / `::after`, nur sichtbar, wenn Kinder expandiert
- Responsive Breakpoints (≤ 992 px): Wrap, reduzierte Mindestbreite, angepasste Abstände

### Analytics
- Sidebar-Klick → `nav_ligauebersicht_click`
- Page View → `page_ligauebersicht_view`
- Tree-Selektion → `tree_ligauebersicht_select` (Parameter `ligaId`)

## Analytics Events

### Getrackte Events:
1. **nav_ligauebersicht_click** - Klick auf Sidebar-Link
2. **page_ligauebersicht_view** - Seitenaufruf der Ligaübersicht

### Format:
```javascript
_paq.push(['trackEvent', 'Navigation', 'EVENT_NAME'])
```

## Zukünftige Erweiterungen
- **Datenquelle**: Ablösung der Mock-/Fallback-Daten durch API (`DATA-001`)
- **Virtualisierung**: Vorbereitet für große Bäume (Lazy Rendering)
- **Detailaktionen**: Kontextmenüs / Verlinkungen zu Liga-Details je Knoten
- **Farbleitsystem**: Zentrale Konfiguration der Level-Farbvarianten im Theme

## Testing

### Unit Tests
```bash
cd swt2-bsa-frontend/bogenliga
npm run test -- --include='src/app/modules/liga-overview/components/tree/tree.component.spec.ts'
# Hinweis: Node 16 + OpenSSL 3 → ggf. export NODE_OPTIONS=--openssl-legacy-provider
```

### Manuelle Checks
- Browser-Start (`npm run start`), Tree Expand/Collapse, Tastaturnavigation, Statusmeldungen
- Analytics-Verifikation über Matomo/Piwik (DevTools → Network/Console)

## Abhängigkeiten

### Externe:
- Angular Router
- ngx-translate
- FontAwesome Icons (`faChartBar`)

### Interne:
- SharedModule
- UserPermission Service
- Matomo/Piwik Analytics

## Deployment-Hinweise

### Build:
```bash
npm run build
```

### Keine Datenbank-Migration erforderlich
### Keine Backend-Änderungen erforderlich

## Status
✅ **Implementierung abgeschlossen**
- Alle Akzeptanzkriterien erfüllt
- Code vollständig dokumentiert
- Unit Tests vorhanden
- Bereit für Integration

## Änderungen an bestehenden Dateien

### Modifizierte Dateien (aktueller Sprint):
1. `app.routing.ts` – Route `/liga`
2. `sidebar.config.ts`, `sidebar.component.ts` – Menüeintrag & Tracking
3. `src/assets/i18n/{de,en}.json` – Texte & Statusmeldungen
4. `modules/liga-overview/components/liga-overview/*` – Datenladung, Status-Handling, Tests
5. `modules/liga-overview/components/tree/*` – Neue Tree-Komponenten + Styles + Tests

### Neue Dateien:
1. `modules/liga-overview/components/tree/` – `tree.component.*`, `tree-node.component.*`, Specs

## Autor
Bogenliga Team

## Version
1.0.0 - Initial Release
