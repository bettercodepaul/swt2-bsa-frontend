import Dexie, {Table} from 'dexie';
import {OfflineLigatabelle} from './types/offline-ligatabelle.interface';
import {OfflineMatch} from './types/offline-match.interface';
import {OfflinePasse} from '@shared/data-provider/offlinedb/types/offline-passe.interface';
import {OfflineWettkampf} from '@shared/data-provider/offlinedb/types/offline-wettkampf.interface';
import {
  OfflineMannschaft
} from '@shared/data-provider/offlinedb/types/offline-mannschaft.interface';


export class OfflineDB extends Dexie {

  ligaTabelle!: Table<OfflineLigatabelle, number>;
  matchTabelle!: Table<OfflineMatch, number>;
  passeTabelle!: Table<OfflinePasse, number>;
  wettkampfTabelle!: Table<OfflineWettkampf, number>;
  mannschaftTabelle!: Table<OfflineMannschaft, number>;

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
        'ringzahlPfeil1, ringzahlPfeil2, ringzahlPfeil3, ringzahlPfeil4, ringzahlPfeil5, ringzahlPfeil6, rueckennummer',
      // Use the same id for the wettkampfTabelle that is already in .id
      wettkampfTabelle: 'id, version, veranstaltungId, datum, beginn, tag, disziplinId, wettkampftypId, ausrichter, strasse, plz, ortsname, ortsinfo, offlinetoken',
      mannschaftTabelle: 'id, version, vereinId, nummer, benutzerId, veranstaltungId, sortierung'

    });
  }
}

export const db = new OfflineDB();
