import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {environment} from '@environment';
import {UriBuilder} from '@shared/data-provider/services/utils/uri-builder.class';
import {LeagueDTO} from '@shared/models/league.dto';
import {LeagueHierarchyResult, LeagueTreeNode} from '@shared/models/tree-node';
import {Observable, of} from 'rxjs';
import {catchError, map, timeout} from 'rxjs/operators';
import { normalize, Dto as NormDto, TreeNode as NormNode } from '../../../../utils/league-normalizer';

// Default timeout for API calls (ms)
const DEFAULT_TIMEOUT_MS = 6000;
// Local mock path for fallback
const MOCK_FLAT_LIST_URL = './assets/mocks/league-hierarchy.json';

@Injectable({ providedIn: 'root' })
export class LeagueHierarchyService {
  private readonly baseUrl = environment.backendBaseUrl;
  private readonly ligaPath = 'v1/liga';

  constructor(private http: HttpClient) {}

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
   * Build a hierarchical tree from flat league list using robust normalizer (dedupe, cycles, missing parents, sorting).
   */
  private fromFlatList(list: LeagueDTO[]): LeagueTreeNode[] {
    if (!Array.isArray(list) || list.length === 0) { return []; }

    // 1) Adapt backend DTOs to normalizer DTOs (string IDs)
    const dtos: NormDto[] = list
      .filter((it) => it != null && Number.isFinite(it.id))
      .map((it) => ({
        id: String(it.id),
        name: it.name ?? '',
        parentId: it.ligaUebergeordnetId == null ? null : String(it.ligaUebergeordnetId)
      }));

    // 2) Normalize (dedupe, cycle-safe, sorted)
    const forest = normalize(dtos, { locale: 'de' });

    // 3) Map back to numeric LeagueTreeNode with computed levels
    const toNumber = (s: string | null | undefined): number | null => {
      if (s == null) return null;
      const n = Number(s);
      return Number.isFinite(n) ? n : null;
    };

    const mapNode = (node: NormNode, level: number): LeagueTreeNode | null => {
      const idNum = toNumber(node.id);
      if (idNum == null) {
        console.warn('LN004 Invalid id after normalization, node dropped:', node.id);
        return null;
      }
      const children = (node.children ?? [])
        .map((c) => mapNode(c, level + 1))
        .filter((x): x is LeagueTreeNode => x != null);
      return {
        id: idNum,
        name: node.name ?? '',
        parentId: toNumber(node.parentId ?? null),
        level,
        children
      };
    };

    return forest
      .map((root) => mapNode(root, 0))
      .filter((x): x is LeagueTreeNode => x != null);
  }
}
