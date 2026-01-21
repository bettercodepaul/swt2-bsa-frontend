import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueHierarchyService } from '@shared/services';
import { LeagueHierarchyResult, LeagueTreeNode } from '@shared/models/tree-node';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeComponent } from '../tree/tree.component';
import { AnalyticsService } from '@shared/services';
import { LIGA_OVERVIEW_PAGE_CONFIG } from './liga-overview.config';
import { ActionButtonColors } from '@shared/components/buttons/button/actionbuttoncolors';

/**
 * Component for the league overview.
 *
 * Renders the league hierarchy using an accessible tree component
 * and handles data loading, status communication and analytics tracking.
 */
@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  /**
   * Maximum tree depth (0-based level) used for "Expand all".
   *
   * Level 4 means 5 expanded levels (0..4). Because children of expanded nodes are visible,
   * this effectively shows 6 levels in the tree.
   */
  private static readonly MAX_TREE_EXPAND_LEVEL = 4;

/**
   * Dialog/page configuration for breadcrumbs, etc. */
  public config = LIGA_OVERVIEW_PAGE_CONFIG;
/** ViewChild reference to the tree component (for deeplink expand). */
  @ViewChild(TreeComponent, { static: false }) treeComponent?: TreeComponent;

/**
   * Current loading state.
   */
  isLoading = false;

  /**
   * Result of the hierarchy load including status.
   */
  hierarchyResult: LeagueHierarchyResult | null = null;

  /**
   * Button color enum for template binding.
   */
  readonly ActionButtonColors = ActionButtonColors;

/**
   * Data source for the tree component.
   */
  treeNodes: LeagueTreeNode[] = [];

/**
   * Currently selected league ID (tree selection).
   * Restored from the service during initialization.
   */
  selectedLigaId: number | null = null;

/**
   * Initially expanded node IDs for the tree.
   * Restored from the service during initialization.
   */
  initialExpandedIds: Set<number> = new Set();

/**
   * Translation key for status messages.
   */
  statusMessageKey: string | null = null;

/**
   * UI state for the Expand-All/Collapse-All button.
   */
  treeAllExpanded = false;

/**
   * Optional hint text from deeplink validation.
   */
  deeplinkMessageKey: string | null = null;

/**
   * Transient error message for deeplink problems; automatically hidden after a timeout.
   */
  deeplinkErrorMessage: string | null = null;

/** Remembers the desired league ID from the URL (if present). */
  private deeplinkLigaId: number | null = null;

  private readonly destroy$ = new Subject<void>();

  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly leagueHierarchyService: LeagueHierarchyService,
    private readonly analytics: AnalyticsService
  ) { }

  ngOnInit(): void {
    // Restore persisted tree state
    this.restoreTreeState();
    this.observeDeeplinkParam();
    this.loadHierarchy();
  }

  ngAfterViewInit(): void {
    this.updateTreeAllExpandedState();
  }

  ngOnDestroy(): void {
    // Persist tree state before destroy
    this.saveTreeState();
    this.destroy$.next();
    this.destroy$.complete();
  }

/**
   * Called when a tree node is selected.
   * Navigates to the league table with the `liga` query param (resolved by the router resolver).
   */
  onTreeSelect(ligaId: number): void {
    this.selectedLigaId = ligaId;
    this.trackSelection(ligaId);

    // Navigation zur jeweiligen Liga-Home-Seite: /home?liga=<id>
    this.router.navigate(
      ['/home'],
      {
        queryParams: { liga: ligaId },
        queryParamsHandling: 'merge'
      }
    );
  }

/**
   * Loads the league hierarchy and prepares the tree.
   */
  private loadHierarchy(): void {
    this.isLoading = true;
    this.hierarchyResult = null;
    this.statusMessageKey = null;

    const stop = this.analytics.startTimer('api_liga_hierarchie');

    this.leagueHierarchyService.getHierarchyCached()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.hierarchyResult = result;
          this.treeNodes = result.data ?? [];
          this.statusMessageKey = this.resolveStatusMessageKey(result);
          this.isLoading = false;

          // Deeplink nach Datenladung anwenden
          this.applyDeeplinkIfPossible();

          this.runAfterRender(() => {
            this.updateTreeAllExpandedState();
            if (result.status === 'ok') {
              const duration = stop();
              this.analytics.trackTiming('api_liga_hierarchie_timing', duration, { status: result.status });
            }
          });
        },
        error: () => {
          this.hierarchyResult = { status: 'error', data: [], reason: 'Unhandled error' };
          this.treeNodes = [];
          this.statusMessageKey = 'LIGAUEBERSICHT.STATUS.ERROR';
          this.isLoading = false;
        }
      });
  }

/**
   * Determines the appropriate status message key.
   */
  private resolveStatusMessageKey(result: LeagueHierarchyResult): string | null {
    switch (result.status) {
      case 'ok': return null;
      case 'empty': return 'LIGAUEBERSICHT.STATUS.EMPTY';
      case 'timeout': return 'LIGAUEBERSICHT.STATUS.TIMEOUT';
      case 'offline-fallback': return 'LIGAUEBERSICHT.STATUS.OFFLINE_FALLBACK';
      default: return 'LIGAUEBERSICHT.STATUS.ERROR';
    }
  }

/**
   * Observes query params and reads `liga` (or legacy: `ligaId`) for deeplink expansion.
   * Supports both, but prioritizes `liga`.
   */
  private observeDeeplinkParam(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const rawLiga = params.get('liga');     // kanonisch (slug oder id)
        const rawLigaId = params.get('ligaId'); // legacy (nur id)

        this.deeplinkMessageKey = null;
        this.deeplinkLigaId = null;

        const candidate = rawLiga ?? rawLigaId;
        if (candidate == null) {
          return;
        }

        // Nur numerische IDs können im Tree expandiert/markiert werden
        const parsed = Number(candidate);
        if (!Number.isFinite(parsed)) {
          // Ungültiges Format für Tree-Expand -> nicht-blockierender Hinweis
          this.deeplinkMessageKey = 'LIGAUEBERSICHT.DEEPLINK.INVALID_ID';
          return;
        }

        this.deeplinkLigaId = parsed;
        // Falls Daten schon da sind, sofort anwenden
        this.applyDeeplinkIfPossible();
      });
  }

/**
   * Applies the deeplink selection as soon as tree data is available.
   */
  private applyDeeplinkIfPossible(): void {
    if (this.deeplinkLigaId == null || !Array.isArray(this.treeNodes) || this.treeNodes.length === 0) {
      return;
    }
    const exists = this.containsNodeId(this.treeNodes, this.deeplinkLigaId);
    if (exists) {
      this.selectedLigaId = this.deeplinkLigaId;
    } else {
      this.deeplinkMessageKey = 'LIGAUEBERSICHT.DEEPLINK.INVALID_ID';
    }
  }

  private containsNodeId(nodes: LeagueTreeNode[], id: number): boolean {
    for (const n of nodes ?? []) {
      if (n.id === id) { return true; }
      if (n.children?.length && this.containsNodeId(n.children, id)) { return true; }
    }
    return false;
  }

/**
   * Shows a non-blocking error message for deeplink problems.
   */
  private showDeeplinkError(messageKey: string): void {
    this.deeplinkErrorMessage = messageKey;
    setTimeout(() => {
      this.deeplinkErrorMessage = null;
    }, 5000);
  }

  /**
   * Schedules a callback after the current render/microtask to approximate post-render timing.
   */
  private runAfterRender(callback: () => void): void {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(callback);
    } else {
      Promise.resolve().then(callback);
    }
  }

/**
   * Manual refresh: clear cache and tree state and reload data.
   */
  onRefresh(): void {
    // Cache und Tree-State invalidieren
    this.leagueHierarchyService.invalidateCache();
    this.leagueHierarchyService.clearTreeState();
    // UI-State zurücksetzen
    this.selectedLigaId = null;
    this.initialExpandedIds = new Set();
    // Neu laden
    this.loadHierarchy();
  }

/**
   * Retry handler for error states.
   * Invalidates the cache and reloads data. Tracks retry attempts for analytics.
   */
  onRetry(): void {
    // Cache invalidieren und neu laden
    this.leagueHierarchyService.invalidateCache().then(() => {
      this.loadHierarchy();
    });
  }


/**
   * Analytics: track tree selection.
   */
  private trackSelection(ligaId: number): void {
    try {
      this.analytics.track('tree_select', { ligaId });
    } catch { /* no-op */ }
  }

/**
   * Restores the tree state from the service.
   */
  private restoreTreeState(): void {
    // Async restore - will update UI when data arrives
    this.leagueHierarchyService.getExpandedIds().then((ids) => {
      if (ids.size > 0) {
        this.initialExpandedIds = ids;
      }
    });
    this.leagueHierarchyService.getSelectedId().then((id) => {
      if (id != null) {
        this.selectedLigaId = id;
      }
    });
  }

/**
   * Persists the current tree state in the service.
   */
  private saveTreeState(): void {
    if (this.treeComponent) {
      this.leagueHierarchyService.saveExpandedIds(this.treeComponent.expandedIds);
    }
    this.leagueHierarchyService.saveSelectedId(this.selectedLigaId);
  }

/**
   * Handler for changes to the set of expanded nodes.
   */
  onExpandedIdsChange(expandedIds: Set<number>): void {
    this.leagueHierarchyService.saveExpandedIds(expandedIds);
    this.updateTreeAllExpandedState();
  }

/**
   * Global tree control: Expand-All / Collapse-All.
   *
   * "Expand all" opens the tree only up to the configured depth.
   * "Collapse all" still collapses the entire tree.
   */
  onToggleExpandCollapseAll(): void {
    if (!this.treeComponent) {
      return;
    }

    if (this.treeAllExpanded) {
      this.treeComponent.collapseAll();
    } else {
      this.treeComponent.expandToLevel(LigaOverviewComponent.MAX_TREE_EXPAND_LEVEL);
    }

    this.updateTreeAllExpandedState();
  }

  private updateTreeAllExpandedState(): void {
    if (!this.treeComponent) {
      this.treeAllExpanded = false;
      return;
    }

    this.treeAllExpanded = this.treeComponent.isExpandedUpToLevel(LigaOverviewComponent.MAX_TREE_EXPAND_LEVEL);
  }
}
