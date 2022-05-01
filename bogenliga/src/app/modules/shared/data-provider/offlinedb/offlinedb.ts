import Dexie, {Table} from 'dexie';
import {OfflineLigatabelle} from './types/offline-ligatabelle.interface';
import {OfflineMatch} from './types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';
import {
  OfflineMannschaftsmitglied
} from '@shared/data-provider/offlinedb/types/offline-mannschaftsmitglied.interface';
import {
  OfflineDsbMitglied
} from "@shared/data-provider/offlinedb/types/offline-dsbmitglied.interface";


/**
 * export interface OfflineDsbMitglied {
 *   id?: number;
 *   version?: number;
 *   vorname: string;
 *   nachname: string;
 *   geburtsdatum: string;
 *   nationalitaet: string;
 *   mitgliedsnummer: string;
 *   vereinId: number;
 *   benutzerId: number;
 * }
 */

export class OfflineDB extends Dexie {

  ligaTabelle!: Table<OfflineLigatabelle, number>;
  matchTabelle!: Table<OfflineMatch, number>;
  passeTabelle!: Table<OfflinePasse, number>;
  wettkampfTabelle!: Table<OfflineWettkampf, number>;
  mannschaftTabelle!: Table<OfflineMannschaft, number>;
  mannschaftsmitgliedTabelle!: Table<OfflineMannschaftsmitglied, number>;
  dsbMitgliederTabelle!: Table<OfflineDsbMitglied, number>;

  constructor() {
    super('offlineBogenligaDb');
    this.version(2).stores({
      // Schema -> Every column name is the name of the attribute of the interface
      ligaTabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
        'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz',
      matchTabelle: '++id, version, matchVersion, wettkampfId, matchNr, matchScheibennummer, mannschaftId,   mannschaftName, ' +
        'nameGegner, scheibennummerGegner, matchIdGegner, naechsteMatchId, naechsteNaechsteMatchNrMatchId,' +
        'strafpunkteSatz1, strafpunkteSatz2, strafpunkteSatz3, strafpunkteSatz4, strafpunkteSatz5',
      passeTabelle: '++id, version, matchID, mannschaftID, wettkampfID, matchNr, lfdNr, dsbMitgliedID, ' +
        'ringzahlPfeil1, ringzahlPfeil2, ringzahlPfeil3, ringzahlPfeil4, ringzahlPfeil5, ringzahlPfeil6, rueckennummer',
      // Use the same id for the wettkampfTabelle that is already in .id
      wettkampfTabelle: 'id, version, veranstaltungId, datum, beginn, tag, disziplinId, wettkampftypId, ausrichter, strasse, plz, ortsname, ortsinfo, offlinetoken',
      mannschaftTabelle: 'id, version, vereinId, nummer, benutzerId, veranstaltungId, sortierung',
      mannschaftsmitgliedTabelle: 'id, version, mannschaftId, dsbMitgliedId, dsbMitgliedEingesetzt, rueckennummer',
      dsbMitgliederTabelle: 'id, version, vorname, nachname, geburtsdatum, nationalitaet, mitgliedsnummer, vereinId, benutzerId'


    });
  }
}

export const db = new OfflineDB();
