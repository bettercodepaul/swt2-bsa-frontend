import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {LeagueHierarchyService} from '@shared/services';
import {LeagueHierarchyResult, LeagueTreeNode} from '@shared/models/tree-node';
import {Subject} from 'rxjs';
import {takeUntil} from 'rxjs/operators';

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

  /** Merkt sich die via URL gewünschte Liga-ID (falls vorhanden). */
  private deeplinkLigaId: number | null = null;

  private readonly destroy$ = new Subject<void>();

  /**
   * Konstruktor
   * @param router Angular Router für Navigation
   * @param route ActivatedRoute für Query-Param Handling
   * @param leagueHierarchyService Service für League-Hierarchie
   */
  constructor(
    private readonly router: Router,
    private readonly route: ActivatedRoute,
    private readonly leagueHierarchyService: LeagueHierarchyService
  ) {
  }

  /**
   * Lifecycle Hook: Initialisierung der Komponente
   *
   * Feuert Analytics Event für Seitenaufruf
   */
  ngOnInit(): void {
    // Analytics-Event für Seitenaufruf
    this.trackPageView();
    this.observeDeeplinkParam();
    this.loadHierarchy();
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
   */
  onTreeSelect(ligaId: number): void {
    this.selectedLigaId = ligaId;
    this.trackSelection(ligaId);
    // Direkte Router-Navigation zur Liga-Startseite (ohne kompletten Seiten-Reload)
    this.router.navigate(['/home', ligaId]);
  }

  /**
   * Tracked den Seitenaufruf für Analytics (Matomo/Piwik)
   *
   * Event-Name: page_ligauebersicht_view
   */
  private trackPageView(): void {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['trackEvent', 'Navigation', 'page_ligauebersicht_view']);
    }
  }

  /**
   * Lädt die Liga-Hierarchie und bereitet den Tree vor.
   */
  private loadHierarchy(): void {
    this.isLoading = true;
    this.hierarchyResult = null;
    this.statusMessageKey = null;
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
        },
        error: () => {
          this.hierarchyResult = {status: 'error', data: [], reason: 'Unhandled error'};
          this.treeNodes = [];
          this.statusMessageKey = 'LIGAUEBERSICHT.STATUS.ERROR';
          this.isLoading = false;
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
   * Analytics-Event für Tree-Selektion.
   */
  private trackSelection(ligaId: number): void {
    if (typeof window !== 'undefined' && (window as any)._paq) {
      (window as any)._paq.push(['trackEvent', 'Navigation', 'tree_ligauebersicht_select', ligaId]);
    }
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
