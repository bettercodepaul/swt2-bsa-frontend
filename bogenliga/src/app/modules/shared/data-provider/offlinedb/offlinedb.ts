import Dexie, { Table } from 'dexie';
import { OfflineLigatabelle } from './types/offline-ligatabelle.interface';

export class OfflineDB extends Dexie {

    ligaTabelle!: Table<OfflineLigatabelle, number>;

    constructor() {
        super('offlineBogenligaDb');
        this.version(1).stores({
            ligaTabelle: '++id, version, veranstaltungId, veranstaltungName, wettkampfId, wettkampfTag, mannschaftId, mannschaftName, ' +
            'matchpkt, matchpktGegen, satzpkt, satzpktGegen, satzpktDifferenz, sortierung, tabellenplatz'
        });
    }
}

export const db = new OfflineDB();
