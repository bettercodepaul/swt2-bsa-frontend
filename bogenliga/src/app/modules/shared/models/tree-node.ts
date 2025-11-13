// UI tree node type for representing the league hierarchy in components

export interface LeagueTreeNode {
  id: number;
  name: string;
  parentId?: number | null;
  level: number; // 0-based depth level (0 for root)
  children: LeagueTreeNode[];
}

export interface LeagueHierarchyResult {
  // High-level status to simplify UI consumption
  status: 'ok' | 'empty' | 'error' | 'timeout' | 'offline-fallback';
  httpStatus?: number;
  reason?: string;
  data: LeagueTreeNode[];
}
