import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LeagueHierarchyService } from '@shared/services';
import { LeagueHierarchyResult, LeagueTreeNode } from '@shared/models/tree-node';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { TreeComponent } from '../tree/tree.component';
import { AnalyticsService } from '@shared/services';
import { LIGA_OVERVIEW_PAGE_CONFIG } from './liga-overview.config';

/**
 * Komponente für die Ligaübersicht.
 *
 * Stellt die Liga-Hierarchie über eine barrierearme Tree-Komponente dar
 * und kümmert sich um Datenladung, Statuskommunikation und Analytics-Tracking.
 */
@Component({
  selector: 'bla-liga-overview',
  templateUrl: './liga-overview.component.html',
  styleUrls: ['./liga-overview.component.scss']
})
export class LigaOverviewComponent implements OnInit, AfterViewInit, OnDestroy {

  /** Dialog-/Seitenkonfiguration für Breadcrumbs etc. */
  public config = LIGA_OVERVIEW_PAGE_CONFIG;

  /** ViewChild-Referenz auf die Tree-Komponente (für Deeplink-Expand). */
  @ViewChild(TreeComponent, { static: false }) treeComponent?: TreeComponent;

  /**
   * Aktueller Ladezustand.
   */
  isLoading = false;

  /**
   * Ergebnis des Hierarchie-Loads inklusive Status.
   */
  hierarchyResult: LeagueHierarchyResult | null = null;

  /**
   * Datenquelle für die Tree-Komponente.
   */
  treeNodes: LeagueTreeNode[] = [];

  /**
   * Aktuell ausgewählte Liga-ID (Tree Selection).
   * Wird beim Init aus dem Service wiederhergestellt.
   */
  selectedLigaId: number | null = null;

  /**
   * Initial expandierte Knoten-IDs für den Tree.
   * Wird beim Init aus dem Service wiederhergestellt.
   */
  initialExpandedIds: Set<number> = new Set();

  /**
   * Übersetzungsschlüssel für Statusmeldungen.
   */
  statusMessageKey: string | null = null;

  /**
   * UI-State für Expand-All/Collapse-All Button.
   */
  treeAllExpanded = false;

  /**
   * Optionaler Hinweistext aus Deeplink-Validierung.
   */
  deeplinkMessageKey: string | null = null;

  /**
   * Flüchtige Fehlermeldung für Deeplink-Probleme; wird automatisch ausgeblendet.
   */
  deeplinkErrorMessage: string | null = null;

  /** Merkt sich die via URL gewünschte Liga-ID (falls vorhanden). */
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
   * Wird aufgerufen, wenn ein Tree-Knoten selektiert wird.
   * Navigiert zur Ligatabelle mit dem liga-QueryParam (Resolver übernimmt die Auflösung).
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
   * Lädt die Liga-Hierarchie und bereitet den Tree vor.
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

          // Fehler-Status für Monitoring tracken
          if (result.status === 'error' || result.status === 'timeout') {
            this.analytics.track('liga_hierarchy_error', {
              status: result.status,
              httpStatus: (result as any).httpStatus,
              reason: result.reason,
              component: 'LigaOverviewComponent'
            });
          }

          this.runAfterRender(() => {
            this.updateTreeAllExpandedState();
            const duration = stop();
            this.analytics.trackTiming('api_liga_hierarchie_timing', duration, { status: result.status });
          });
        },
        error: (err) => {
          this.hierarchyResult = { status: 'error', data: [], reason: 'Unhandled error' };
          this.treeNodes = [];
          this.statusMessageKey = 'LIGAUEBERSICHT.STATUS.ERROR';
          this.isLoading = false;

          // Unerwartete Fehler für Monitoring tracken
          this.analytics.track('liga_hierarchy_error', {
            status: 'unhandled',
            reason: err?.message || 'Unknown error',
            component: 'LigaOverviewComponent'
          });

          this.runAfterRender(() => {
            const duration = stop();
            this.analytics.trackTiming('api_liga_hierarchie_timing', duration, { status: 'error' });
          });
        }
      });
  }

  /**
   * Bestimmt die passende Statusmeldung.
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
   * Beobachtet Query-Params und liest liga (oder legacy: ligaId) für Deeplink-Expand.
   * Unterstützt beides, priorisiert aber 'liga'.
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
   * Wendet die Deeplink-Selektion an, sobald Baumdaten verfügbar sind.
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
   * Zeigt eine nicht-blockierende Fehlermeldung für Deeplink-Probleme.
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
   * Retry-Handler für Fehlerzustände.
   * Invalidiert Cache und lädt Daten neu. Trackt Retry-Versuch für Analytics.
   */
  onRetry(): void {
    // Retry-Versuch tracken
    this.analytics.track('liga_hierarchy_retry', {
      previousStatus: this.hierarchyResult?.status,
      httpStatus: (this.hierarchyResult as any)?.httpStatus,
      reason: this.hierarchyResult?.reason
    });

    // Cache invalidieren und neu laden
    this.leagueHierarchyService.invalidateCache().then(() => {
      this.loadHierarchy();
    });
  }

  /**
   * Analytics: Tree-Selektion tracken.
   */
  private trackSelection(ligaId: number): void {
    try {
      this.analytics.track('tree_select', { ligaId });
    } catch { /* no-op */ }
  }

  /**
   * Stellt den Tree-State aus dem Service wieder her.
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
   * Speichert den aktuellen Tree-State im Service.
   */
  private saveTreeState(): void {
    if (this.treeComponent) {
      this.leagueHierarchyService.saveExpandedIds(this.treeComponent.expandedIds);
    }
    this.leagueHierarchyService.saveSelectedId(this.selectedLigaId);
  }

  /**
   * Handler für Änderungen an den expandierten Knoten.
   */
  onExpandedIdsChange(expandedIds: Set<number>): void {
    this.leagueHierarchyService.saveExpandedIds(expandedIds);
    this.updateTreeAllExpandedState();
  }

  /**
   * Globale Baumsteuerung: Expand-All / Collapse-All.
   */
  onToggleExpandCollapseAll(): void {
    if (!this.treeComponent) {
      return;
    }

    if (this.treeAllExpanded) {
      this.treeComponent.collapseAll();
    } else {
      this.treeComponent.expandAll();
    }

    this.updateTreeAllExpandedState();
  }

  private updateTreeAllExpandedState(): void {
    this.treeAllExpanded = this.treeComponent?.isAllExpanded() ?? false;
  }
}
