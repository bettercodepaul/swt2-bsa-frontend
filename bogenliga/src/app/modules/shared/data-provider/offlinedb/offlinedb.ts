import Dexie, {Table} from 'dexie';
import {OfflineLigatabelle} from './types/offline-ligatabelle.interface';
import {OfflineMatch} from './types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';


export class OfflineDB extends Dexie {

  ligaTabelle!: Table<OfflineLigatabelle, number>;
  matchTabelle!: Table<OfflineMatch, number>;
  passeTabelle!: Table<OfflinePasse, number>;

  constructor() {
    super('offlineBogenligaDb');
    this.version(1).stores({
      // Schema -> Every column name is the name of the attribute of the interface
      ligaTabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
        'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz',
      matchTabelle: '++id, version, matchVersion, wettkampfId, matchNr, matchScheibennummer, mannschaftId,   mannschaftName, ' +
        'nameGegner, scheibennummerGegner, matchIdGegner, naechsteMatchId, naechsteNaechsteMatchNrMatchId,' +
        'strafpunkteSatz1, strafpunkteSatz2, strafpunkteSatz3, strafpunkteSatz4, strafpunkteSatz5',
      passeTabelle: '++id, version, matchID, mannschaftID, wettkampfID, matchNr, lfdNr, dsbMitgliedID, ' +
        'ringzahlPfeil1, ringzahlPfeil2, ringzahlPfeil3, ringzahlPfeil4, ringzahlPfeil5, ringzahlPfeil6, rueckennummer'

    });
  }
}

export const db = new OfflineDB();
