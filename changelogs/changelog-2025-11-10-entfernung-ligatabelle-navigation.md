# Changelog

Alle bemerkenswerten Änderungen an diesem Projekt werden in dieser Datei dokumentiert.

Das Format basiert auf [Keep a Changelog](https://keepachangelog.com/de/1.0.0/),
und dieses Projekt hält sich an [Semantic Versioning](https://semver.org/lang/de/).

## [Unreleased]

## [2025-11-10] - Entfernung der Ligatabelle-Navigation

### Entfernt
- Routing-Einträge `/ligatabelle` und `/ligatabelle/:id` aus `bogenliga/src/app/app.routing.ts`.
- Sidebar-Menüpunkte `SIDEBAR.MANNSCHAFTEN` für Online- und Offline-Konfiguration (`bogenliga/src/app/components/sidebar/sidebar.config.ts`).

### Geändert
- `SidebarComponent`: Routinglogik bereinigt – `/ligatabelle`-Sonderfall entfernt, Analytics-Tracking unverändert (`bogenliga/src/app/components/sidebar/sidebar.component.ts`).
- `RegionenComponent`: Ligaauswahl navigiert jetzt zur neuen Ligaübersicht `/liga`; auskommentierte Ligatabelle-Referenzen gelöscht (`bogenliga/src/app/modules/regionen/components/regionen/regionen.component.ts`).
- Dokumentation `ENTFERNUNG_ALTE_LIGATABELLE.md` um Status-Update ergänzt (`bogenliga/ENTFERNUNG_ALTE_LIGATABELLE.md`).

### Technische Details
- **Commit**: wird nach Merge gesetzt
- **Autor**: Joshua Jeglinski
- **Datum**: 2025-11-10
- **Dateien geändert**: 5 Dateien (aktualisiert)

### Tests
- `npm run lint` *(nicht ausgeführt – bitte im CI laufen lassen)*
- Manuelle Schnellprüfung im Browser empfohlen: Sidebar-Navigation öffnen, Ligaauswahl über Regionen testen, direkte URL `/ligatabelle` ansteuern (soll 404 liefern).

### Offene Punkte
- Restliche Übersetzungen und Rückbau des Ligatabelle-Moduls erfolgen im Zuge von EPIC 4.


