import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '@environment';
import { UriBuilder } from '@shared/data-provider/services/utils/uri-builder.class';
import { LeagueDTO } from '@shared/models/league.dto';
import { LeagueHierarchyResult, LeagueTreeNode } from '@shared/models/tree-node';
import { Observable, of } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';

// Default timeout for API calls (ms)
const DEFAULT_TIMEOUT_MS = 6000;
// Local mock path for fallback
const MOCK_FLAT_LIST_URL = './assets/mocks/league-hierarchy.json';

/**
 * Service für das Laden der Liga-Hierarchie.
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
      map((list) => this.fromFlatList(list)),
      map((nodes) => nodes.length === 0
        ? ({ status: 'empty', data: nodes } as LeagueHierarchyResult)
        : ({ status: 'ok', data: nodes } as LeagueHierarchyResult)
      ),
      catchError((err: HttpErrorResponse | any) => this.handleErrorThenFallback(err))
    );
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
