/*
 * League Normalizer
 * Transforms raw DTOs from API to a UI-friendly tree with deterministic sorting and robust handling of inconsistencies.
 * Logs warnings with codes: LN001 (Missing parent), LN002 (Duplicate), LN003 (Cycle)
 */

export type Dto = {
  id: string;
  name: string;
  parentId?: string | null;
};

export type TreeNode = {
  id: string;
  name: string;
  parentId?: string | null;
  children: TreeNode[];
};

// Internal accumulator to merge duplicates before linking
type NodeAcc = {
  id: string;
  name: string;
  parentId?: string | null;
  children: TreeNode[]; // will be populated after linking
};

const WARN = {
  MISSING_PARENT: 'LN001',
  DUPLICATE: 'LN002',
  CYCLE: 'LN003',
} as const;

type LocaleOptions = {
  locale?: string | string[];
};

function nameComparatorFactory({ locale }: LocaleOptions = {}): (a: TreeNode, b: TreeNode) => number {
  const loc = locale ?? 'de';
  return (a: TreeNode, b: TreeNode) => {
    const an = a.name ?? '';
    const bn = b.name ?? '';

    const aEmpty = an.trim().length === 0;
    const bEmpty = bn.trim().length === 0;
    if (aEmpty && !bEmpty) return 1; // empty last
    if (!aEmpty && bEmpty) return -1;

    return an.localeCompare(bn, loc, { sensitivity: 'base' });
  };
}

/**
 * Normalize raw DTOs into a forest (array of roots) of TreeNodes.
 * - stable IDs
 * - deterministic alphabetical sorting (by name)
 * - defensive handling of inconsistencies (missing parents, duplicates, cycles)
 */
export function normalize(input: Dto[], opts: LocaleOptions = {}): TreeNode[] {
  if (!Array.isArray(input) || input.length === 0) return [];

  // Step 1: Merge duplicates by id
  const byId = new Map<string, NodeAcc>();
  for (const dto of input) {
    if (!dto || typeof dto.id !== 'string') {
      // Skip invalid entries silently
      continue;
    }
    const existing = byId.get(dto.id);
    if (!existing) {
      byId.set(dto.id, {
        id: dto.id,
        name: dto.name ?? '',
        parentId: dto.parentId ?? null,
        children: [],
      });
    } else {
      // Duplicate merge: first non-empty name wins; parentId keeps existing if already set, otherwise take dto.parentId
      if ((existing.name ?? '').trim().length === 0 && (dto.name ?? '').trim().length > 0) {
        existing.name = dto.name as string;
      }
      if (existing.parentId == null && dto.parentId != null) {
        existing.parentId = dto.parentId;
      }
      console.warn(`${WARN.DUPLICATE} Duplicate id: Node ${dto.id} merged.`);
    }
  }

  // Convert to nodes for linking
  const nodes = new Map<string, TreeNode>();
  for (const acc of byId.values()) {
    nodes.set(acc.id, { id: acc.id, name: acc.name ?? '', parentId: acc.parentId ?? null, children: [] });
  }

  // Step 2: Link children, detect cycles, and identify roots
  const roots: TreeNode[] = [];

  // Build temp parent->children edges respecting missing parents and self-loops
  for (const node of nodes.values()) {
    const parentId = node.parentId ?? null;
    if (parentId && parentId === node.id) {
      // self-loop => break and treat as root
      node.parentId = null;
      console.warn(`${WARN.CYCLE} Cycle detected: self-loop ${node.id}->${parentId}; edge ignored.`);
      roots.push(node);
      continue;
    }

    if (parentId && nodes.has(parentId)) {
      // Tentatively attach; cycle-safe finalization via DFS below
      const parent = nodes.get(parentId)!;
      parent.children.push(node);
    } else {
      if (parentId) {
        console.warn(`${WARN.MISSING_PARENT} Missing parent: Node ${node.id} treated as root (parentId=${parentId} not found).`);
      }
      // parent missing or null => root
      node.parentId = null;
      roots.push(node);
    }
  }

  // Step 3: Remove cycles via DFS on the forest (roots)
  const visited = new Set<string>();
  const onStack = new Set<string>();

  function dfs(curr: TreeNode): void {
    visited.add(curr.id);
    onStack.add(curr.id);

    const nextChildren: TreeNode[] = [];
    for (const child of curr.children) {
      if (!visited.has(child.id)) {
        dfs(child);
        // Only include if not pruned elsewhere
        if (!createsBackEdge(curr.id, child.id)) {
          nextChildren.push(child);
        }
      } else if (onStack.has(child.id)) {
        // Back-edge => cycle
        console.warn(`${WARN.CYCLE} Cycle detected: edge ${curr.id}->${child.id} ignored.`);
        // skip adding this child
      } else {
        // Cross/forward edge in a DAG; accept
        nextChildren.push(child);
      }
    }
    curr.children = dedupeById(nextChildren);

    onStack.delete(curr.id);
  }

  function createsBackEdge(_from: string, _to: string): boolean {
    // after dfs(child) returned, child is no longer on stack; back-edge is handled above
    return false;
  }

  function dedupeById(items: TreeNode[]): TreeNode[] {
    const seen = new Set<string>();
    const out: TreeNode[] = [];
    for (const it of items) {
      if (!seen.has(it.id)) {
        seen.add(it.id);
        out.push(it);
      }
    }
    return out;
  }

  for (const r of roots) {
    if (!visited.has(r.id)) dfs(r);
  }

  // Step 4: Deterministic sorting for children and roots
  const cmp = nameComparatorFactory(opts);

  function sortRec(node: TreeNode) {
    node.children.sort(cmp);
    for (const c of node.children) sortRec(c);
  }

  for (const r of roots) sortRec(r);
  roots.sort(cmp);

  return roots;
}

/**
 * Find path (list of node IDs) from any root to the target node ID.
 * Returns null if not found.
 */
export function findPathTo(forest: TreeNode[], nodeId: string): string[] | null {
  for (const root of forest) {
    const path: string[] = [];
    const found = dfsFind(root, nodeId, path);
    if (found) return path;
  }
  return null;
}

function dfsFind(node: TreeNode, targetId: string, path: string[]): boolean {
  path.push(node.id);
  if (node.id === targetId) return true;
  for (const child of node.children) {
    if (dfsFind(child, targetId, path)) return true;
  }
  path.pop();
  return false;
}
