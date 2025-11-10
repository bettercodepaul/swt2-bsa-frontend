# Ticket-Dokumentation: Entfernung der alten Ligatabellen-Navigation

## Kontext
- Ziel: Alle direkten Navigationspfade zur alten Ligatabelle (`/ligatabelle`, `/ligatabelle/:id`) deaktivieren, damit ausschließlich die neue Ligaübersicht (`/liga`) verwendet wird.
- Hintergrund: Vorbereitung für EPIC 4 (vollständiger Rückbau des Ligatabelle-Moduls).
- Referenz: `bogenliga/ENTFERNUNG_ALTE_LIGATABELLE.md` (Detail-Dokumentation im Projektstamm).

## Umgesetzte Änderungen
- Routing (`src/app/app.routing.ts`): Einträge für `/ligatabelle` entfernt.
- Sidebar (`src/app/components/sidebar/sidebar.config.ts` & `.component.ts`): Menüpunkt „Mannschaften“ und Ligatabelle-spezifische URL-Logik entfernt.
- Regionenmodul (`src/app/modules/regionen/components/regionen/regionen.component.ts`): Ligaauswahl navigiert nun zu `/liga`.
- Projektdokumentation & Changelog: Aktualisierte Statusübersicht und neuer Eintrag `changelogs/changelog-2025-11-10-entfernung-ligatabelle-navigation.md`.

## Auswirkungen für Benutzer:innen
- Sidebar zeigt keinen Link mehr zur alten Ligatabelle.
- Direkte Aufrufe von `/ligatabelle` resultieren in 404; stattdessen führt die Navigation zur neuen Ligaübersicht.
- Regionenansicht leitet nach Ligaauswahl sofort zur Ligaübersicht.

## Test- und Rollout-Hinweise
- Browser-Test: Sidebar öffnen, Liga über Regionen auswählen → Weiterleitung nach `/liga`.
- Direkte URL-Tests: `/ligatabelle` bzw. `/ligatabelle/:id` aufrufen → erwarteter 404.
- Empfohlen: `npm run lint` sowie e2e-/Manualtests in CI, sobald verfügbar.

## Offene Punkte / Folgearbeiten
- i18n-Einträge und Restbestand des Ligatabelle-Moduls werden im Rahmen von EPIC 4 bereinigt.
- Analytics-Tracking für `/liga` bleibt aktiv; Monitoring der Zugriffszahlen prüfen.


