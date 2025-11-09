# Feature: Ligaübersicht (Issue #1957-Frontend)

## Übersicht
Dieses Feature implementiert einen neuen Menüpunkt "Ligaübersicht" in der globalen Seitennavigation mit Router-Anbindung und Analytics-Integration.

## Implementierte Komponenten

### 1. Modul und Komponente
**Pfad**: `src/app/modules/liga-overview/`

#### Dateien:
- `liga-overview.module.ts` - Angular-Modul für die Ligaübersicht
- `liga-overview.routing.ts` - Routing-Konfiguration
- `index.ts` - Export-Datei für das Modul
- `components/liga-overview/liga-overview.component.ts` - Haupt-Komponente
- `components/liga-overview/liga-overview.component.html` - HTML-Template
- `components/liga-overview/liga-overview.component.scss` - Styles
- `components/liga-overview/liga-overview.component.spec.ts` - Unit Tests

#### Funktionalität:
- Zeigt eine Platzhalter-Seite mit Info-Alert an
- Trackt Seitenaufrufe über Matomo Analytics (`page_ligauebersicht_view`)
- Bereitet die Integration einer zukünftigen Baumstruktur vor

### 2. Routing
**Datei**: `src/app/app.routing.ts`

**Änderung**: Neue Route `/liga` hinzugefügt
```typescript
{path: 'liga', loadChildren: () => import('src/app/modules/liga-overview/liga-overview.module').then((m) => m.LigaOverviewModule)}
```

### 3. Navigation
**Datei**: `src/app/components/sidebar/sidebar.config.ts`

**Änderungen**:
- Import des Icons `faChartBar` für die Ligaübersicht
- Neuer Menüpunkt in `SIDE_BAR_CONFIG` (Online-Modus)
- Neuer Menüpunkt in `SIDE_BAR_CONFIG_OFFLINE` (Offline-Modus)

**Konfiguration**:
```typescript
{
  label: 'SIDEBAR.LIGAUEBERSICHT',
  icon: faChartBar,
  route: '/liga',
  permissons: [UserPermission.CAN_READ_DEFAULT],
  subitems: [],
  datacy: 'sidebar-ligauebersicht-button'
}
```

### 4. Analytics-Integration
**Datei**: `src/app/components/sidebar/sidebar.component.ts`

**Neue Methode**: `trackNavigationClick(route: string)`
- Feuert Analytics-Event `nav_ligauebersicht_click` beim Klick auf den Sidebar-Link
- Integration mit Matomo/Piwik über `window._paq`

### 5. Internationalisierung (i18n)
**Datei**: `src/assets/i18n/de.json`

**Neue Übersetzungen**:
```json
"SIDEBAR": {
  "LIGAUEBERSICHT": "Ligaübersicht"
},
"LIGAUEBERSICHT": {
  "TITLE": "Ligaübersicht",
  "DESCRIPTION": "Hier finden Sie eine zentrale Übersicht aller Ligen mit ihren hierarchischen Strukturen.",
  "PLACEHOLDER": "Die Ligaübersicht befindet sich derzeit in der Entwicklung. Datenintegration erfolgt in Kürze."
}
```

### 6. Unit Tests
**Datei**: `liga-overview.component.spec.ts`

**Testfälle**:
- ✓ Komponente kann erstellt werden
- ✓ `ngOnInit()` wird ohne Fehler ausgeführt
- ✓ Analytics-Event wird korrekt getrackt (wenn `_paq` verfügbar)
- ✓ Kein Fehler wenn `_paq` nicht verfügbar ist

## Akzeptanzkriterien

### ✅ Erfüllt:
1. **Eintrag "Ligaübersicht" sichtbar** - Menüpunkt in Sidebar hinzugefügt
2. **Navigation zu "/liga"** - Route registriert und lädt Komponente
3. **Basis-Seite ohne Fehler** - Leerer Baum-Placeholder wird angezeigt
4. **Analytics-Event** - `nav_ligauebersicht_click` und `page_ligauebersicht_view` werden gefeuert

## Code-Dokumentation

### JSDoc-Kommentare
Alle TypeScript-Dateien enthalten umfassende JSDoc-Kommentare:
- Datei-/Klassen-Level Dokumentation mit `@author` und `@version`
- Methoden-Dokumentation mit Parameter-Beschreibungen
- Inline-Kommentare für komplexe Logik

### Coding-Standards
- **Style Guide**: Befolgt Angular Style Guide und bestehendes Projekt-Pattern
- **Naming**: Konsistente Namenskonventionen (kebab-case für Dateien, PascalCase für Klassen)
- **Modulstruktur**: Folgt der bestehenden Modul-Organisation
- **Imports**: Verwendet Pfad-Aliase (@shared, etc.)

## Navigation und Breadcrumbs

### Verhalten:
- **Start über Hauptmenü**: Breadcrumb-Pfad wird korrekt gesetzt
- **Back-Navigation**: Funktioniert über Browser-Navigation
- **Konsistent**: Folgt dem bestehenden Navigationsmuster der App

## Analytics Events

### Getrackte Events:
1. **nav_ligauebersicht_click** - Klick auf Sidebar-Link
2. **page_ligauebersicht_view** - Seitenaufruf der Ligaübersicht

### Format:
```javascript
_paq.push(['trackEvent', 'Navigation', 'EVENT_NAME'])
```

## Zukünftige Erweiterungen

### Vorbereitungen für Datenintegration:
- Platzhalter-Div mit Klasse `liga-tree-placeholder` vorbereitet
- Info-Alert informiert Benutzer über Entwicklungsstatus
- Modul-Struktur ermöglicht einfache Integration von Services und Data-Providern

### Nächste Schritte:
1. Backend-API für Liga-Hierarchie implementieren
2. Service für Datenabruf erstellen
3. Baumstruktur-Komponente implementieren
4. Platzhalter durch echte Daten ersetzen

## Testing

### Unit Tests ausführen:
```bash
cd swt2-bsa-frontend/bogenliga
npm test -- --include='**/liga-overview/**/*.spec.ts'
```

### E2E-Tests (zukünftig):
- Navigation zum Menüpunkt testen
- Route-Loading testen
- Analytics-Events verifizieren

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

### Modifizierte Dateien:
1. `app.routing.ts` - Route hinzugefügt
2. `sidebar.config.ts` - Menüeintrag hinzugefügt
3. `sidebar.component.ts` - Analytics-Tracking hinzugefügt
4. `de.json` - Übersetzungen hinzugefügt

### Neue Dateien:
1. `modules/liga-overview/` - Komplettes neues Modul mit 7 Dateien

## Autor
Bogenliga Team

## Version
1.0.0 - Initial Release
