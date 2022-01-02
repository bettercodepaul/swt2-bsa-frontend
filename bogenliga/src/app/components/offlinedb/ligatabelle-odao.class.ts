/* This is a 'physical' class that is mapped to
 * the ligatabelle table. We can have methods on it that
 * we could call on retrieved database objects.
 */

import {Oligatabelle} from './types/oligatabelle.interface';
import {OfflinedbComponent} from './offlinedb.component';

export class LigatabelleOdaoClass implements Oligatabelle {
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
  ligaranking: Oligatabelle[]; // hier werden die Einträge aus der Tabelle als Feld bereitgestellt
  db: OfflinedbComponent;

  constructor( db: OfflinedbComponent, veranstaltungId: number,
               veranstaltungName: string, wettkampfId: number, wettkampfTag: number,
               mannschaftId: number, mannschaftName: string, matchpkt: number,
               matchpktGegen: number, satzpkt: number, satzpktGegen: number,
               satzpktDifferenz: number, sortierung: number, tabellenplatz: number, id?: number) {
    this.db = db;
    this.veranstaltungId = veranstaltungId;
    this.veranstaltungName = veranstaltungName;
    this.wettkampfId = wettkampfId;
    this.wettkampfTag = wettkampfTag;
    this.mannschaftId = mannschaftId;
    this.mannschaftName = mannschaftName;
    this.matchpkt = matchpkt;
    this.matchpktGegen = matchpktGegen;
    this.satzpkt = satzpkt;
    this.satzpktGegen = satzpktGegen;
    this.satzpktDifferenz = satzpktDifferenz;
    this.sortierung = sortierung;
    this.tabellenplatz = tabellenplatz;
    if (id) { this.id = id; }
  }

  loadLigatabelle() {
    const ligaranking = this.db.ligatabelle.toArray();
  }

}
