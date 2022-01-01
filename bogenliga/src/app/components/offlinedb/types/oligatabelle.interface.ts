// Offline Ligaballe -> Oligatabelle
// index id only available on client

import {VersionedDataObject} from '@shared/data-provider/models/versioned-data-object.interface';

export class Oligatabelle implements VersionedDataObject {
  id: number; // Primary Key autoincrement
  version: number;

  veranstaltungId: number; // technischer Schüssel der Veranstaltung (Liga im Jahr)
  veranstaltungName: string; // Bezeichnung der Veranstaltung
  wettkampfId: number; // technischer Schlüssel des aktuellen Wettkampftages
  wettkampfTag: number; // Nummer des Wettkampftages i.d.R. <= 4
  mannschaftId: number; // Mannschaft der Liga
  mannschaftName: string; // Bezeichnung der Mannschaft i.D.R. Vereinsname + ein Nummer
  matchpkt: number; // akt. Stand der Matchpunkte der Mannschaft vor Wettkampfbeginn
  matchpktGegen: number; // akt. Stand der Gegen-Matchpunkte der Mannschaft vor Wettkampfbeginn
  satzpkt: number; // akt. Stand der Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktGegen: number; // akt. Stand der Gegen-Satzpunkte der Mannschaft vor Wettkampfbeginn
  satzpktDifferenz: number; // akt. Stand der Satzpunktedifferenz der Mannschaft vor Wettkampfbeginn
  sortierung: number; // Sortierungskennzeichen zu Liga.Start
  tabellenplatz: number; // Tabellenplatz der Mannschaft vor Wettkampfbeginn
}
