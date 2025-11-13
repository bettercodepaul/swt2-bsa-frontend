import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LeagueHierarchyService} from '@shared/services';
import {LeagueHierarchyResult, LeagueTreeNode} from '@shared/models/tree-node';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';
import {buildLeagueUrl, isValidLigaId} from '../../utils/league-url.helper';
import {TreeComponent} from '../tree/tree.component';
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
export class LigaOverviewComponent implements OnInit, OnDestroy {

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

  /** Button-Label-Zustand: true = alles aufgeklappt */
  expandAllActive = false;

  /**
   * Datenquelle für die Tree-Komponente.
   */
  treeNodes: LeagueTreeNode[] = [];

  /**
   * Aktuell ausgewählte Liga-ID (Tree Selection).
   */
  selectedLigaId: number | null = null;

  /**
   * Übersetzungsschlüssel für Statusmeldungen.
   */
  statusMessageKey: string | null = null;

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

  /**
   * Konstruktor
   * @param router Angular Router für Navigation
   * @param route ActivatedRoute für Query-Parameter
   * @param leagueHierarchyService Service für League-Hierarchie
   */
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly leagueHierarchyService: LeagueHierarchyService,
    private readonly analytics: AnalyticsService
  ) {
  }

  /**
   * Lifecycle Hook: Initialisierung der Komponente
   *
   * Feuert Analytics Event für Seitenaufruf und verarbeitet Query-Parameter.
   */
 ngOnInit(): void {
  this.observeDeeplinkParam();
  this.loadHierarchy();
  this.expandAllActive = false;
}

  /**
   * Lifecycle Hook: Aufräumen.
   */
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * Wird aufgerufen, wenn ein Tree-Knoten selektiert wird.
   * Navigiert zur Liga-Homepage mit der entsprechenden Liga-ID.
   */
  onTreeSelect(ligaId: number): void {
    this.selectedLigaId = ligaId;
    this.trackSelection(ligaId);
    // Direkte Router-Navigation zur Liga-Startseite (ohne kompletten Seiten-Reload)
    this.router.navigate(['/home', ligaId]);
  }

  /** Toolbar: alle Knoten auf-/zuklappen */
  onToggleExpandAll(): void {
    if (!this.treeComponent) { return; }
    if (this.treeComponent.isFullyExpanded()) {
      this.treeComponent.collapseAll();
      this.expandAllActive = false;
    } else {
      this.treeComponent.expandAll();
      this.expandAllActive = true;
    }
  }



  /**
   * Lädt die Liga-Hierarchie und bereitet den Tree vor.
   */
  private loadHierarchy(): void {
    this.isLoading = true;
    this.hierarchyResult = null;
    this.statusMessageKey = null;

    // Performance: measure fetch-start → render
    const stop = this.analytics.startTimer('api_liga_hierarchie');

    this.leagueHierarchyService.getHierarchy()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.hierarchyResult = result;
          this.treeNodes = result.data ?? [];
          this.statusMessageKey = this.resolveStatusMessageKey(result);
          this.isLoading = false;
          // Deeplink nach Datenladung anwenden
          this.applyDeeplinkIfPossible();

          // Timing nach dem Rendern erfassen (OK)
          this.runAfterRender(() => {
            const duration = stop();
            this.analytics.trackTiming('api_liga_hierarchie_timing', duration, { status: 'ok' });
          });
        },
        error: () => {
          this.hierarchyResult = {status: 'error', data: [], reason: 'Unhandled error'};
          this.treeNodes = [];
          this.statusMessageKey = 'LIGAUEBERSICHT.STATUS.ERROR';
          this.isLoading = false;

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
      case 'ok':
        return null;
      case 'empty':
        return 'LIGAUEBERSICHT.STATUS.EMPTY';
      case 'timeout':
        return 'LIGAUEBERSICHT.STATUS.TIMEOUT';
      case 'offline-fallback':
        return 'LIGAUEBERSICHT.STATUS.OFFLINE_FALLBACK';
      default:
        return 'LIGAUEBERSICHT.STATUS.ERROR';
    }
  }


  /**
   * Verarbeitet Deeplink-Query-Parameter (ligaId).
   * 
   * Liest den Query-Parameter aus und expandiert/markiert den entsprechenden
   * Knoten im Baum, falls vorhanden. Bei ungültiger ID wird eine Meldung angezeigt.
   */
  private handleDeeplink(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const ligaIdParam = params['ligaId'];
        
        if (ligaIdParam == null) {
          return;
        }

        const ligaId = Number(ligaIdParam);
        
        if (!isValidLigaId(ligaId)) {
          this.showDeeplinkError('LIGAUEBERSICHT.DEEPLINK.INVALID_ID');
          return;
        }

        // Warten, bis Daten geladen sind
        this.waitForDataThenExpand(ligaId);
      });
  }

  /**
   * Wartet auf das Laden der Hierarchie-Daten und expandiert dann den Pfad.
   */
  private waitForDataThenExpand(ligaId: number): void {
    // Prüfen, ob Daten bereits geladen sind
    if (this.treeNodes.length > 0) {
      this.expandToNode(ligaId);
      return;
    }

    // Auf Datenladen warten (max. 5 Sekunden)
    const checkInterval = setInterval(() => {
      if (this.treeNodes.length > 0) {
        clearInterval(checkInterval);
        this.expandToNode(ligaId);
      }
    }, 100);

    setTimeout(() => {
      clearInterval(checkInterval);
    }, 5000);
  }

  /**
   * Expandiert den Pfad zu einem Knoten.
   */
  private expandToNode(ligaId: number): void {
    if (!this.treeComponent) {
      return;
    }

    const success = this.treeComponent.expandPathTo(ligaId);
    
    if (!success) {
      this.showDeeplinkError('LIGAUEBERSICHT.DEEPLINK.NOT_FOUND');
    }
  }

  /**
   * Navigiert zur Liga-Homepage mit der angegebenen Liga-ID.
   */
  private navigateToLeagueHomepage(ligaId: number): void {
    try {
      const url = buildLeagueUrl(ligaId);
      if (typeof window !== 'undefined') {
        window.location.assign(url);
      }
    } catch (error) {
      console.error('Failed to navigate to league homepage:', error);
    }
  }

  /**
   * Zeigt eine nicht-blockierende Fehlermeldung für Deeplink-Probleme.
   */
  private showDeeplinkError(messageKey: string): void {
    this.deeplinkErrorMessage = messageKey;
    // Nachricht nach 5 Sekunden ausblenden
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
   * Analytics: Tree-Selektion tracken.
   */
  private trackSelection(ligaId: number): void {
    try {
      this.analytics.track('tree_select', { ligaId });
    } catch { /* no-op */ }
  }

  /**
   * Beobachtet Query-Params und liest ligaId (falls vorhanden).
   */
  private observeDeeplinkParam(): void {
    this.route.queryParamMap
      .pipe(takeUntil(this.destroy$))
      .subscribe((params) => {
        const raw = params.get('ligaId');
        this.deeplinkMessageKey = null;
        this.deeplinkLigaId = null;
        if (raw == null) {
          return;
        }
        const parsed = Number(raw);
        if (!Number.isFinite(parsed)) {
          // Ungültiges Format -> nicht-blockierender Hinweis
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

}
