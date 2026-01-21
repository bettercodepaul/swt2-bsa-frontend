import { LeagueTreeNode } from '@shared/models/tree-node';

/**
 * Interface für den gecachten Liga-Hierarchie-Eintrag in der offlinedb.
 * Verwendet einen Singleton-Ansatz mit fester ID = 1.
 */
export interface OfflineLeagueHierarchyCache {
    /** Feste ID (1) für Singleton-Cache-Eintrag */
    id: number;
    /** Die gecachten Hierarchie-Daten als Baum */
    data: LeagueTreeNode[];
    /** Timestamp (ms seit Epoch) wann der Cache erstellt wurde */
    cachedAt: number;
    /** Status des gecachten Ergebnisses */
    status: 'ok' | 'empty' | 'offline-fallback';
    /** IDs der expandierten Knoten für Tree-State-Wiederherstellung */
    expandedIds?: number[];
    /** ID des selektierten Knotens */
    selectedId?: number | null;
}
