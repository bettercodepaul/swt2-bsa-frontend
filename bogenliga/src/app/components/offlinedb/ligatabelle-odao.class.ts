/* This is a 'physical' class that is mapped to
 * the ligatabelle table. We can have methods on it that
 * we could call on retrieved database objects.
 */

import {Oligatabelle} from './types/oligatabelle.interface';
import {OfflinedbComponent} from './offlinedb.component';
import {db} from './offlinedb.component';

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

  constructor( veranstaltungId: number,
               veranstaltungName: string, wettkampfId: number, wettkampfTag: number,
               mannschaftId: number, mannschaftName: string, matchpkt: number,
               matchpktGegen: number, satzpkt: number, satzpktGegen: number,
               satzpktDifferenz: number, sortierung: number, tabellenplatz: number,
               id?: number, version?: number) {
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
    if (version) { this.version = version; } else { this.version = 1; }
  }

  private save() {
    return db.transaction('rw', db.match, () => {
      db.ligatabelle.put(new LigatabelleOdaoClass(this.veranstaltungId, this.veranstaltungName, this.wettkampfId,
        this.wettkampfTag, this.mannschaftId, this.mannschaftName, this.matchpkt, this.matchpktGegen,
        this.satzpkt, this.satzpktGegen , this.satzpktDifferenz, this.sortierung, this.tabellenplatz));
    });
  }

  private update() {
    this.version++;
    return db.transaction('rw', db.match, () => {
      db.ligatabelle.update(this.id,
        {veranstaltungId: this.veranstaltungId, veranstaltungName: this.veranstaltungName,
          wettkampfId: this.wettkampfId, wettkampfTag: this.wettkampfTag, mannschaftId: this.mannschaftId,
          mannschaftName: this.mannschaftName, matchpkt: this.matchpkt, matchpktGegen: this.matchpktGegen,
          satzpkt: this.satzpkt, satzpktGegen: this.satzpktGegen, satzpktDifferenz: this.satzpktDifferenz,
          sortierung: this.sortierung, tabellenplatz: this.tabellenplatz, version: this.version});
    });
  }

}

