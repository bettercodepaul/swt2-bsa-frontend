import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environment';
import { UriBuilder } from '@shared/data-provider/services/utils/uri-builder.class';
import { LeagueDTO } from '@shared/models/league.dto';
import { LeagueHierarchyResult, LeagueTreeNode, PaginatedChildrenResult } from '@shared/models/tree-node';
import { Observable, of, from } from 'rxjs';
import { catchError, map, timeout, tap, switchMap, retry } from 'rxjs/operators';
import { db } from '@shared/data-provider/offlinedb/offlinedb';
import { OfflineLeagueHierarchyCache } from '@shared/data-provider/offlinedb/types/offline-league-hierarchy-cache.interface';

// Default timeout for API calls (ms)
const DEFAULT_TIMEOUT_MS = 6000;
// Local mock path for fallback
const MOCK_FLAT_LIST_URL = './assets/mocks/league-hierarchy.json';
// Default cache TTL: 5 minutes
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;
// Default page size for pagination
const DEFAULT_PAGE_SIZE = 50;
// Fixed cache entry ID (singleton) - Changed to force cache refresh for lazy loading
const CACHE_ENTRY_ID = 4;
// Aktiviert echtes Lazy Loading: Kinder werden erst beim Expand geladen
const LAZY_LOADING_ENABLED = true;

/**
 * Service für das Laden der Liga-Hierarchie.
 *
 * Beinhaltet IndexedDB-basiertes Caching (über offlinedb/Dexie) mit konfigurierbarer TTL.
 * Cache überlebt Browser-Neustarts und bietet bessere Performance als SessionStorage.
 */
@Injectable({ providedIn: 'root' })
export class LeagueHierarchyService {
  private readonly baseUrl = environment.backendBaseUrl;
  private readonly ligaPath = 'v1/liga';

  constructor(private http: HttpClient) { }

  /**
   * Loads league hierarchy as a tree. Builds the tree client-side from the flat league list.
   * Robust handling: timeout, HTTP error mapping, and local mock fallback.
   */
  getHierarchy(options?: { timeoutMs?: number }): Observable<LeagueHierarchyResult> {
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const url = new UriBuilder().fromPath(this.baseUrl).path(this.ligaPath).build();

    return this.http.get<LeagueDTO[]>(url).pipe(
      timeout(timeoutMs),
      retry(2),
      map((list) => this.fromFlatList(list)),
      map((nodes) => nodes.length === 0
        ? ({ status: 'empty', data: nodes } as LeagueHierarchyResult)
        : ({ status: 'ok', data: nodes } as LeagueHierarchyResult)
      ),
      catchError((err: HttpErrorResponse | any) => this.handleErrorThenFallback(err))
    );
  }

  /**
   * Loads league hierarchy with IndexedDB caching (offlinedb).
   * Repeated calls within TTL return cached data instantly.
   * Cache persists across browser restarts.
   *
   * @param options.timeoutMs HTTP timeout (default: 6000ms)
   * @param options.ttlMs Cache TTL (default: 5 min)
   */
  getHierarchyCached(options?: { timeoutMs?: number; ttlMs?: number }): Observable<LeagueHierarchyResult> {
    const ttlMs = options?.ttlMs ?? DEFAULT_CACHE_TTL_MS;

    return from(this.getCachedEntry()).pipe(
      switchMap((cached) => {
        const now = Date.now();
        const isCacheValid = cached !== undefined && (now - cached.cachedAt) < ttlMs;

        if (isCacheValid && cached) {
          // Cache hit - return cached data
          return of({
            status: cached.status,
            data: cached.data
          } as LeagueHierarchyResult);
        }

        // Cache miss or expired - fetch fresh data
        return this.getHierarchy({ timeoutMs: options?.timeoutMs }).pipe(
          tap((result) => {
            // Only cache successful results
            if (result.status === 'ok' || result.status === 'empty' || result.status === 'offline-fallback') {
              this.setCachedEntry(result).catch(() => { /* ignore cache write errors */ });
            }
          })
        );
      }),
      catchError(() => {
        // If cache access fails, fall back to direct API call
        return this.getHierarchy({ timeoutMs: options?.timeoutMs });
      })
    );
  }

  /**
   * Invalidates the cached hierarchy data.
   * Next call to getHierarchyCached will fetch fresh data from the API.
   */
  async invalidateCache(): Promise<void> {
    try {
      await db.leagueHierarchyCache.delete(CACHE_ENTRY_ID);
    } catch {
      // Ignore errors during cache invalidation
    }
  }

  /**
   * Checks if cached hierarchy data is still valid.
   */
  async isCacheValid(ttlMs: number = DEFAULT_CACHE_TTL_MS): Promise<boolean> {
    try {
      const cached = await this.getCachedEntry();
      if (!cached) return false;
      return (Date.now() - cached.cachedAt) < ttlMs;
    } catch {
      return false;
    }
  }

  // --- Private cache helpers ---

  private async getCachedEntry(): Promise<OfflineLeagueHierarchyCache | undefined> {
    return db.leagueHierarchyCache.get(CACHE_ENTRY_ID);
  }

  private async setCachedEntry(result: LeagueHierarchyResult): Promise<void> {
    // Preserve existing tree state when updating cache
    const existing = await this.getCachedEntry();
    const entry: OfflineLeagueHierarchyCache = {
      id: CACHE_ENTRY_ID,
      data: result.data,
      cachedAt: Date.now(),
      status: result.status as 'ok' | 'empty' | 'offline-fallback',
      expandedIds: existing?.expandedIds,
      selectedId: existing?.selectedId
    };
    await db.leagueHierarchyCache.put(entry);
  }

  // --- Tree State Persistence ---

  /**
   * Speichert die IDs der expandierten Knoten.
   */
  async saveExpandedIds(ids: Set<number>): Promise<void> {
    try {
      const entry = await this.getCachedEntry();
      if (entry) {
        entry.expandedIds = [...ids];
        await db.leagueHierarchyCache.put(entry);
      }
    } catch { /* ignore */ }
  }

  /**
   * Lädt die gespeicherten expandierten Knoten-IDs.
   */
  async getExpandedIds(): Promise<Set<number>> {
    try {
      const entry = await this.getCachedEntry();
      if (entry?.expandedIds) {
        return new Set(entry.expandedIds);
      }
    } catch { /* ignore */ }
    return new Set();
  }

  /**
   * Speichert die aktuell selektierte Liga-ID.
   */
  async saveSelectedId(id: number | null): Promise<void> {
    try {
      const entry = await this.getCachedEntry();
      if (entry) {
        entry.selectedId = id;
        await db.leagueHierarchyCache.put(entry);
      }
    } catch { /* ignore */ }
  }

  /**
   * Lädt die gespeicherte selektierte Liga-ID.
   */
  async getSelectedId(): Promise<number | null> {
    try {
      const entry = await this.getCachedEntry();
      return entry?.selectedId ?? null;
    } catch { /* ignore */ }
    return null;
  }

  /**
   * Prüft ob ein gespeicherter Tree-State existiert.
   */
  async hasPersistedTreeState(): Promise<boolean> {
    try {
      const entry = await this.getCachedEntry();
      if (!entry) return false;
      return (entry.expandedIds?.length ?? 0) > 0 || entry.selectedId != null;
    } catch {
      return false;
    }
  }

  /**
   * Setzt den Tree-State zurück.
   */
  async clearTreeState(): Promise<void> {
    try {
      const entry = await this.getCachedEntry();
      if (entry) {
        entry.expandedIds = undefined;
        entry.selectedId = undefined;
        await db.leagueHierarchyCache.put(entry);
      }
    } catch { /* ignore */ }
  }

  // --- Error handling ---

  /**
   * Try to recover by serving local mock data if available; otherwise emit mapped error.
   */
  private handleErrorThenFallback(err: HttpErrorResponse | any): Observable<LeagueHierarchyResult> {
    const mapped = this.mapError(err);
    // Attempt local mock fallback
    return this.http.get<LeagueDTO[]>(MOCK_FLAT_LIST_URL).pipe(
      map((list) => this.fromFlatList(list)),
      map((nodes) => ({ status: 'offline-fallback', data: nodes } as LeagueHierarchyResult)),
      catchError(() => of(mapped))
    );
  }

  private mapError(err: HttpErrorResponse | any): LeagueHierarchyResult {
    if (err?.name === 'TimeoutError') {
      return { status: 'timeout', data: [], reason: 'Request timed out' };
    }
    if (err instanceof HttpErrorResponse) {
      return { status: 'error', data: [], httpStatus: err.status, reason: err.message };
    }
    return { status: 'error', data: [], reason: 'Unknown error' };
  }

  // --- Tree building ---

  /**
   * Build a hierarchical tree from flat league list using ligaUebergeordnetId as parent reference.
   * If LAZY_LOADING_ENABLED, children are not included - they will be loaded on demand.
   */
  private fromFlatList(list: LeagueDTO[]): LeagueTreeNode[] {
    if (!Array.isArray(list) || list.length === 0) { return []; }

    const byId = new Map<number, LeagueTreeNode>();
    const childrenByParent = new Map<number, LeagueTreeNode[]>();
    const roots: LeagueTreeNode[] = [];

    // Create nodes
    for (const item of list) {
      const node: LeagueTreeNode = {
        id: item.id,
        name: item.name,
        parentId: item.ligaUebergeordnetId ?? null,
        level: 0,
        children: []
      };
      byId.set(item.id, node);
    }

    // Collect children per parent
    for (const item of list) {
      const node = byId.get(item.id)!;
      const parentId = item.ligaUebergeordnetId ?? null;
      if (parentId == null) {
        roots.push(node);
      } else {
        const parent = byId.get(parentId);
        if (parent) {
          node.level = parent.level + 1;
          if (!childrenByParent.has(parentId)) {
            childrenByParent.set(parentId, []);
          }
          childrenByParent.get(parentId)!.push(node);
        } else {
          // Orphan node without existing parent -> treat as root
          roots.push(node);
        }
      }
    }

    // Set children and lazyState based on LAZY_LOADING_ENABLED
    for (const [parentId, children] of childrenByParent) {
      const parent = byId.get(parentId);
      if (parent) {
        // Always store children in the tree (needed for getChildrenOf to work)
        parent.children = children;

        if (LAZY_LOADING_ENABLED) {
          // Mark as "not yet loaded" for UI - children will be rendered after expand
          parent.childCount = children.length;
          parent.lazyState = {
            childrenLoaded: false,
            childrenLoading: false,
            loadedChildrenCount: 0,
            hasMoreChildren: children.length > DEFAULT_PAGE_SIZE,
            totalChildren: children.length
          };
        }
      }
    }

    return roots;
  }

  // --- Lazy Loading / Pagination ---

  /**
   * Konfigurierbare Page Size für Pagination.
   */
  readonly PAGE_SIZE = DEFAULT_PAGE_SIZE;

  /**
   * Lädt Kinder eines Knotens mit Pagination.
   * Client-Side Implementierung: Filtert aus dem gecachten Gesamtbaum.
   * Sobald Backend-Endpunkt verfügbar, kann auf API umgestellt werden.
   *
   * @param parentId ID des Eltern-Knotens
   * @param options limit/offset für Pagination
   */
  getChildrenOf(
    parentId: number,
    options?: { limit?: number; offset?: number }
  ): Observable<PaginatedChildrenResult> {
    const limit = options?.limit ?? DEFAULT_PAGE_SIZE;
    const offset = options?.offset ?? 0;

    // Client-Side: Aus Cache laden und filtern
    return from(this.getCachedEntry()).pipe(
      map((cached) => {
        if (!cached?.data) {
          return { data: [], offset, limit, hasMore: false };
        }

        // Finde den Parent-Knoten rekursiv
        const parent = this.findNodeById(cached.data, parentId);
        if (!parent) {
          return { data: [], offset, limit, hasMore: false };
        }

        const allChildren = parent.children ?? [];
        const total = allChildren.length;
        const paginatedChildren = allChildren.slice(offset, offset + limit);
        const hasMore = offset + limit < total;

        return {
          data: paginatedChildren,
          offset,
          limit,
          total,
          hasMore
        };
      }),
      catchError(() => of({ data: [], offset, limit, hasMore: false }))
    );
  }

  /**
   * Findet einen Knoten rekursiv im Baum.
   */
  private findNodeById(nodes: LeagueTreeNode[], id: number): LeagueTreeNode | null {
    for (const node of nodes ?? []) {
      if (node.id === id) {
        return node;
      }
      if (node.children?.length) {
        const found = this.findNodeById(node.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }
}
