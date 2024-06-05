import Dexie, {Table} from 'dexie';
import {OfflineLigatabelle} from './types/offline-ligatabelle.interface';
import {OfflineMatch} from './types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {OfflineMannschaft} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {OfflineMannschaftsmitglied} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {OfflineDsbMitglied} from '@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface';
import {OfflineVeranstaltung} from '@shared/data-provider/offlinedb/types/offline-veranstaltung.interface';
import {OfflineVerein} from '@shared/data-provider/offlinedb/types/offline-verein.interface';
import {OfflineTrigger} from '@shared/data-provider/offlinedb/types/offline-trigger.interface';


/**
 * The OfflineDb class is a wrapper for the Dexie database.
 *
 */

export class OfflineDB extends Dexie {

  /**
   *  Every table in the database is defined here.
   */
  ligaTabelle!: Table<OfflineLigatabelle, number>;
  matchTabelle!: Table<OfflineMatch, number>;
  passeTabelle!: Table<OfflinePasse, number>;
  wettkampfTabelle!: Table<OfflineWettkampf, number>;
  mannschaftTabelle!: Table<OfflineMannschaft, number>;
  mannschaftsmitgliedTabelle!: Table<OfflineMannschaftsmitglied, number>;
  dsbMitgliedTabelle!: Table<OfflineDsbMitglied, number>;
  veranstaltungTabelle!: Table<OfflineVeranstaltung, number>;
  vereinTabelle!: Table<OfflineVerein, number>;
  triggerTabelle!: Table<OfflineTrigger, number>;

  /**
   * Constructor for the OfflineDB class.
   */
  constructor() {
    super('offlineBogenligaDb');
    this.version(9).stores({
      // Schema -> Every column name is the name of the attribute of the interface
      // ligatabelle - will read only - no offlineVersion, no sync back
      ligaTabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
                     'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz',
      matchTabelle: ', offlineVersion, matchId, matchVersion, wettkampfId, matchNr, matchScheibennummer,matchpkt,satzpunkte, mannschaftId,   mannschaftName, ' +
                     'nameGegner, scheibennummerGegner, matchIdGegner, naechsteMatchId, naechsteNaechsteMatchNrMatchId,' +
                     'strafpunkteSatz1, strafpunkteSatz2, strafpunkteSatz3, strafpunkteSatz4, strafpunkteSatz5',
      passeTabelle: ', offlineVersion, passeId, version, matchID, mannschaftID, wettkampfID, matchNr, lfdNr, dsbMitgliedID, ' +
                     'ringzahlPfeil1, ringzahlPfeil2, ringzahlPfeil3, ringzahlPfeil4, ringzahlPfeil5, ringzahlPfeil6, rueckennummer',
      // wettkampfTabelle - will read only - no offlineVersion, no sync back
      // Use the same id for the wettkampfTabelle that is already in .id
      wettkampfTabelle: ', version, veranstaltungId, datum, beginn, tag, disziplinId, wettkampftypId, ' +
                          'ausrichter, strasse, plz, ortsname, ortsinfo, offlinetoken',
      // mannschaftTabelle - will read only - no offlineVersion, no sync back
      mannschaftTabelle:          ', version, vereinId, nummer, benutzerId, veranstaltungId, sortierung',
      mannschaftsmitgliedTabelle: ', offlineVersion, id, mannschaftId, dsbMitgliedId, dsbMitgliedEingesetzt, rueckennummer',
      dsbMitgliedTabelle:         ', version, vorname, nachname, geburtsdatum, nationalitaet, mitgliedsnummer, vereinId, benutzerId, beitrittsdatum',
      // veranstaltungTabelle - will read only - no offlineVersion, no sync back
      veranstaltungTabelle: ', offline_version, id, version, name, sportjahr, meldeDeadline, ligaleiterId, ligaId, phase, groesse',
      // vereinTabelle - will read only - no offlineVersion, no sync back
      vereinTabelle: ', version, name, identifier, regionId, regionName, website, description, icon'


    });
  }
}

export const db = new OfflineDB();
