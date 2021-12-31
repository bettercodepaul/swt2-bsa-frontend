/* This is a 'physical' class that is mapped to
 * the ligatabelle table. We can have methods on it that
 * we could call on retrieved database objects.
 */
import {ILigatabelle} from './offlinedb.component';

export class OfflineligatabelleClass implements ILigatabelle {
  id?: number; // Primary Key autoincrement
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
  ligaranking: ILigatabelle[]; // hier werden die Einträge aus der Tabelle als Feld bereitgestellt

  constructor(
    veranstaltungId: number, veranstaltungName: string, wettkampfId: number, wettkampfTag: number,
    mannschaftId: number, mannschaftName: string, matchpkt: number, matchpktGegen: number, satzpkt: number,
    satzpktGegen: number, satzpktDifferenz: number, sortierung: number, tabellenplatz: number, id?: number) {
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
    return Promise.all()
      .then(x => this);
  }

  save() {
    return db.transaction('rw', db.contacts, db.emails, db.phones, () => {
      return Promise.all(
        // Save existing arrays
        Promise.all(this.emails.map(email => db.emails.put(email))),
        Promise.all(this.phones.map(phone => db.phones.put(phone)))
      )
        .then(results => {
          // Remove items from DB that is was not saved here:
          var emailIds = results[0], // array of resulting primary keys
            phoneIds = results[1]; // array of resulting primary keys

          db.emails.where('contactId').equals(this.id)
            .and(email => emailIds.indexOf(email.id) === -1)
            .delete();

          db.phones.where('contactId').equals(this.id)
            .and(phone => phoneIds.indexOf(phone.id) === -1)
            .delete();

          // At last, save our own properties.
          // (Must not do put(this) because we would get
          // reduntant emails/phones arrays saved into db)
          db.contacts.put(new Contact(this.first, this.last, this.id))
            .then(id => this.id = id);
        });
    });
  }
}
