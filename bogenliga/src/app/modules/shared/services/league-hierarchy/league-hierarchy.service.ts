import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environment';
import { UriBuilder } from '@shared/data-provider/services/utils/uri-builder.class';
import { LeagueDTO } from '@shared/models/league.dto';
import { LeagueHierarchyResult, LeagueTreeNode } from '@shared/models/tree-node';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout, tap, shareReplay } from 'rxjs/operators';

// Default timeout for API calls (ms)
const DEFAULT_TIMEOUT_MS = 6000;
// Local mock path for fallback
const MOCK_FLAT_LIST_URL = './assets/mocks/league-hierarchy.json';
// Default cache TTL: 5 minutes
const DEFAULT_CACHE_TTL_MS = 5 * 60 * 1000;

// SessionStorage keys
const STORAGE_KEY_CACHE = 'liga-hierarchy-cache';
const STORAGE_KEY_CACHE_TIMESTAMP = 'liga-hierarchy-cache-timestamp';
const STORAGE_KEY_EXPANDED_IDS = 'liga-hierarchy-expanded-ids';
const STORAGE_KEY_SELECTED_ID = 'liga-hierarchy-selected-id';

/**
 * Service für das Laden der Liga-Hierarchie.
 *
 * Beinhaltet SessionStorage-basiertes Caching mit konfigurierbarer TTL zur Reduzierung
 * von wiederholten API-Aufrufen. Cache überlebt Page-Reloads.
 */
@Injectable({ providedIn: 'root' })
export class LeagueHierarchyService {
  private readonly baseUrl = environment.backendBaseUrl;
  private readonly ligaPath = 'v1/liga';

  // For deduplication of in-flight requests (in-memory only)
  private pendingRequest$: Observable<LeagueHierarchyResult> | null = null;
  private cacheTtlMs: number = DEFAULT_CACHE_TTL_MS;

  constructor(private http: HttpClient) { }

  // --- Tree State Persistence (SessionStorage) ---

  /** Speichert die IDs der expandierten Knoten. */
  get expandedIds(): Set<number> {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_EXPANDED_IDS);
      if (stored) {
        return new Set<number>(JSON.parse(stored));
      }
    } catch { /* ignore */ }
    return new Set<number>();
  }

  set expandedIds(ids: Set<number>) {
    try {
      sessionStorage.setItem(STORAGE_KEY_EXPANDED_IDS, JSON.stringify([...ids]));
    } catch { /* ignore */ }
  }

  /** Speichert die aktuell selektierte Liga-ID. */
  get selectedId(): number | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_SELECTED_ID);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch { /* ignore */ }
    return null;
  }

  set selectedId(id: number | null) {
    try {
      if (id === null) {
        sessionStorage.removeItem(STORAGE_KEY_SELECTED_ID);
      } else {
        sessionStorage.setItem(STORAGE_KEY_SELECTED_ID, JSON.stringify(id));
      }
    } catch { /* ignore */ }
  }

  /** Prüft ob ein gespeicherter Tree-State existiert. */
  hasPersistedTreeState(): boolean {
    return this.expandedIds.size > 0 || this.selectedId !== null;
  }

  /** Setzt den Tree-State zurück. */
  clearTreeState(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY_EXPANDED_IDS);
      sessionStorage.removeItem(STORAGE_KEY_SELECTED_ID);
    } catch { /* ignore */ }
  }

  // --- Cache Persistence (SessionStorage) ---

  private getCachedResult(): LeagueHierarchyResult | null {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_CACHE);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch { /* ignore */ }
    return null;
  }

  private setCachedResult(result: LeagueHierarchyResult): void {
    try {
      sessionStorage.setItem(STORAGE_KEY_CACHE, JSON.stringify(result));
      sessionStorage.setItem(STORAGE_KEY_CACHE_TIMESTAMP, JSON.stringify(Date.now()));
    } catch { /* ignore */ }
  }

  private getCacheTimestamp(): number {
    try {
      const stored = sessionStorage.getItem(STORAGE_KEY_CACHE_TIMESTAMP);
      if (stored) {
        return JSON.parse(stored);
      }
    } catch { /* ignore */ }
    return 0;
  }

  /**
   * Loads league hierarchy as a tree. Builds the tree client-side from the flat league list.
   * Robust handling: timeout, HTTP error mapping, and local mock fallback.
   */
  getHierarchy(options?: { timeoutMs?: number }): Observable<LeagueHierarchyResult> {
    const timeoutMs = options?.timeoutMs ?? DEFAULT_TIMEOUT_MS;
    const url = new UriBuilder().fromPath(this.baseUrl).path(this.ligaPath).build();

    return this.http.get<LeagueDTO[]>(url).pipe(
      timeout(timeoutMs),
      map((list) => this.fromFlatList(list)),
      map((nodes) => nodes.length === 0
        ? ({ status: 'empty', data: nodes } as LeagueHierarchyResult)
        : ({ status: 'ok', data: nodes } as LeagueHierarchyResult)
      ),
      catchError((err: HttpErrorResponse | any) => this.handleErrorThenFallback(err))
    );
  }

  /**
   * Loads league hierarchy with client-side caching (sessionStorage).
   * Repeated calls within TTL return cached data instantly.
   * Cache persists across page reloads.
   *
   * @param options.timeoutMs HTTP timeout (default: 6000ms)
   * @param options.ttlMs Cache TTL (default: 5 min)
   */
  getHierarchyCached(options?: { timeoutMs?: number; ttlMs?: number }): Observable<LeagueHierarchyResult> {
    const ttlMs = options?.ttlMs ?? DEFAULT_CACHE_TTL_MS;
    this.cacheTtlMs = ttlMs;

    // Check if we have valid cached data
    const now = Date.now();
    const cacheTimestamp = this.getCacheTimestamp();
    const cacheAge = now - cacheTimestamp;
    const cachedResult = this.getCachedResult();
    const isCacheValid = cachedResult !== null && cacheAge < this.cacheTtlMs;

    if (isCacheValid && cachedResult) {
      return of(cachedResult);
    }

    // If there's already a request in flight, return that
    if (this.pendingRequest$) {
      return this.pendingRequest$;
    }

    // Make a new request
    this.pendingRequest$ = this.getHierarchy({ timeoutMs: options?.timeoutMs }).pipe(
      tap((result) => {
        this.setCachedResult(result);
        this.pendingRequest$ = null;
      }),
      shareReplay(1)
    );

    return this.pendingRequest$;
  }

  /**
   * Invalidates the cached hierarchy data.
   * Next call to getHierarchyCached will fetch fresh data from the API.
   */
  invalidateCache(): void {
    try {
      sessionStorage.removeItem(STORAGE_KEY_CACHE);
      sessionStorage.removeItem(STORAGE_KEY_CACHE_TIMESTAMP);
    } catch { /* ignore */ }
    this.pendingRequest$ = null;
  }

  /**
   * Checks if cached hierarchy data is still valid.
   */
  isCacheValid(): boolean {
    const now = Date.now();
    const cacheAge = now - this.getCacheTimestamp();
    return this.getCachedResult() !== null && cacheAge < this.cacheTtlMs;
  }

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

  /**
   * Build a hierarchical tree from flat league list using ligaUebergeordnetId as parent reference.
   */
  private fromFlatList(list: LeagueDTO[]): LeagueTreeNode[] {
    if (!Array.isArray(list) || list.length === 0) { return []; }

    const byId = new Map<number, LeagueTreeNode>();
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

    // Link children and collect roots
    for (const item of list) {
      const node = byId.get(item.id)!;
      const parentId = item.ligaUebergeordnetId ?? null;
      if (parentId == null) {
        roots.push(node);
      } else {
        const parent = byId.get(parentId);
        if (parent) {
          node.level = parent.level + 1;
          parent.children.push(node);
        } else {
          // Orphan node without existing parent -> treat as root
          roots.push(node);
        }
      }
    }

    return roots;
  }
}
