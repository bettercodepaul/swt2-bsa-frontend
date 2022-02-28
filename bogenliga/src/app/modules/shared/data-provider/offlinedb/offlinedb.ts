import Dexie, { Table } from 'dexie';
import { OfflineLigatabelle } from './types/offline-ligatabelle.interface';
import { OfflineMatch } from './types/offline-match.interface';


export class OfflineDB extends Dexie {

    ligaTabelle!: Table<OfflineLigatabelle, number>;
    matchTabelle!: Table<OfflineMatch, number>;

    constructor() {
        super('offlineBogenligaDb');
        this.version(1).stores({
            ligaTabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
            'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz',
            matchTabelle: '++id, version, matchVersion, wettkampfId, matchNr, matchScheibennummer, mannschaftId,   mannschaftName, ' +
            'nameGegner, scheibennummerGegner, matchIdGegner, naechsteMatchId, naechsteNaechsteMatchNrMatchId,' +
            'strafpunkteSatz1, strafpunkteSatz2, strafpunkteSatz3, strafpunkteSatz4, strafpunkteSatz5'
        });
    }
}

export const db = new OfflineDB();
