// UI tree node type for representing the league hierarchy in components

/**
 * State für Lazy Loading eines einzelnen Knotens.
 */
export interface LazyLoadState {
  /** Wurden Kinder bereits geladen? */
  childrenLoaded: boolean;
  /** Läuft gerade ein Ladevorgang für Kinder? */
  childrenLoading: boolean;
  /** Gesamtanzahl Kinder (für Pagination, falls vom Backend geliefert) */
  totalChildren?: number;
  /** Anzahl bereits geladener Kinder */
  loadedChildrenCount: number;
  /** Gibt es noch mehr Kinder zum Nachladen? */
  hasMoreChildren: boolean;
}

export interface LeagueTreeNode {
  id: number;
  name: string;
  parentId?: number | null;
  level: number; // 0-based depth level (0 for root)
  children: LeagueTreeNode[];
  /** Lazy Loading Metadaten (optional, nur für UI-State) */
  lazyState?: LazyLoadState;
  /** Anzahl der Kinder (vom Backend, für hasChildren ohne zu laden) */
  childCount?: number;
}

export interface LeagueHierarchyResult {
  // High-level status to simplify UI consumption
  status: 'ok' | 'empty' | 'error' | 'timeout' | 'offline-fallback';
  httpStatus?: number;
  reason?: string;
  data: LeagueTreeNode[];
}

/**
 * Result für paginierte Kinder-Abfrage.
 */
export interface PaginatedChildrenResult {
  data: LeagueTreeNode[];
  offset: number;
  limit: number;
  total?: number;
  hasMore: boolean;
}
