-- Setzt den Demo-Wettkampf 3001 (V39-Migration "Demo Wettkampfdurchfuehrung")
-- fuer die Cypress-Tests des Tablet-Schusszettels auf den Ausgangszustand zurueck.
--
-- Die Backend-State-Machine kennt nur Vorwaerts-Transitionen
-- (SCHUETZENMELDUNG -> SATZEINGABE -> WARTE -> MATCH_ENDE -> WETTKAMPF_ENDE),
-- deshalb muessen Sessions, Passen und Match-Ergebnisse direkt in der DB
-- geloescht werden, damit jeder Testlauf identisch startet.

BEGIN;

-- 1) Tablet-Sessions entfernen (werden beim ersten Laden der Admin-Seite neu angelegt)
DELETE FROM schusszettel_tablet_session WHERE wettkampf_id = 3001;

-- 2) Eingegebene Passen des Demo-Wettkampfs loeschen
DELETE FROM passe WHERE passe_wettkampf_id = 3001;

-- 3) Match-Ergebnisse zuruecksetzen (V39 legt die Matches mit NULL-Werten an)
UPDATE match
SET match_matchpunkte        = NULL,
    match_satzpunkte         = NULL,
    match_strafpunkte_satz_1 = NULL,
    match_strafpunkte_satz_2 = NULL,
    match_strafpunkte_satz_3 = NULL,
    match_strafpunkte_satz_4 = NULL,
    match_strafpunkte_satz_5 = NULL
WHERE match_wettkampf_id = 3001;

-- 4) "eingesetzt"-Markierung der Demo-Schuetzen zuruecksetzen
--    (Schuetzenmeldung setzt eingesetzt = aktuelle Matchnummer;
--     Ausgangszustand laut V39 ist 1, sonst sind Schuetzen nicht waehlbar)
UPDATE mannschaftsmitglied
SET mannschaftsmitglied_dsb_mitglied_eingesetzt = 1
WHERE mannschaftsmitglied_mannschaft_id BETWEEN 3001 AND 3008;

COMMIT;
