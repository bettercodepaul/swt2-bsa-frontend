import {
  AfterViewInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  HostListener,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges
} from '@angular/core';
import { LeagueTreeNode } from '@shared/models/tree-node';
import { AnalyticsService } from '@shared/services';
import { AccessibleTreeBase, NodeId } from '@shared/a11y/accessible-tree.base';

/**
 * Barrierearme Baum-Komponente zur Darstellung der Liga-Hierarchie.
 *
 * - Unterstützt Expand/Collapse, Selektion und Tastaturnavigation (Pfeiltasten, Enter, Space)
 * - Verwendet Roving-Tabindex für Fokussteuerung
 * - Setzt ARIA-Rollen (tree, treeitem, group) und Attribute (aria-expanded, aria-selected)
 *
 * Virtualisierung wird vorbereitet, aber erst in späteren Sprints aktiviert.
 */
@Component({
  selector: 'bla-league-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent extends AccessibleTreeBase implements OnChanges, AfterViewInit, OnDestroy {

  /**
   * Eingabedaten: Baum-Knoten (Wald). Die Reihenfolge entspricht der Anzeige.
   */
  @Input()
  nodes: LeagueTreeNode[] = [];

  /**
   * Optional vorselektierte Liga-ID.
   */
  @Input()
  selectedId: NodeId | null = null;

  /**
   * Event: Wird ausgelöst, wenn der Benutzer einen Knoten selektiert (Enter/Space oder Klick).
   */
  @Output()
  readonly select = new EventEmitter<NodeId>();

  /**
   * Event: Wird bei Änderung der expandierten Knoten ausgelöst.
   */
  @Output()
  readonly expandedIdsChange = new EventEmitter<Set<NodeId>>();

  /**
   * Optional: Initiale expandierte Knoten-IDs für State-Wiederherstellung.
   */
  @Input()
  initialExpandedIds: Set<NodeId> = new Set();

  /**
   * Flag ob initiale expandedIds bereits angewendet wurden.
   */
  private initialStateApplied = false;

  protected get treeNodes(): LeagueTreeNode[] {
    return this.nodes ?? [];
  }

  constructor(
    host: ElementRef<HTMLElement>,
    cdr: ChangeDetectorRef,
    private readonly analytics: AnalyticsService
  ) {
    super(host, cdr);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) {
      this.rebuildLookup(this.nodes);
      // Initialen State anwenden wenn vorhanden und noch nicht angewendet
      if (!this.initialStateApplied && this.initialExpandedIds.size > 0) {
        this.expandedIds = new Set(this.initialExpandedIds);
        this.initialStateApplied = true;
      } else {
        this.ensureRootsExpanded();
      }
      this.updateVisibleNodes();
      this.ensureFocusableNode();
      // Falls bereits eine Selektion vorliegt, Pfad expandieren
      if (this.selectedId != null) {
        this.expandAncestors(this.selectedId);
      }
    }

    if (changes['initialExpandedIds'] && !this.initialStateApplied) {
      const newInitial = changes['initialExpandedIds'].currentValue as Set<NodeId>;
      if (newInitial && newInitial.size > 0) {
        this.expandedIds = new Set(newInitial);
        this.initialStateApplied = true;
        this.updateVisibleNodes();
      }
    }

    if (changes['selectedId']) {
      // Bei Selektion Pfad expandieren und Fokus setzen
      const next = changes['selectedId'].currentValue as number | null;
      if (next != null) {
        this.expandAncestors(next);
        this.focusNode(next);
      }
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.markViewInitialized();
  }

  ngOnDestroy(): void {
    this.cleanupTreeState();
  }

  /**
   * Keydown-Handler für Roving-Tabindex und Expand/Collapse via Tastatur.
   */
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    this.onKeydown(event);
  }

  /**
   * Wird vom Kind ausgelöst: toggelt Expand/Collapse eines Knotens.
   */
  onToggle(nodeId: NodeId, expand?: boolean): void {
    this.handleToggle(nodeId, expand);
  }

  protected handleToggle(nodeId: NodeId, expand?: boolean): void {
    const isExpanded = this.expandedIds.has(nodeId);
    const shouldExpand = expand ?? !isExpanded;

    // Analytics: tree expand/collapse
    const node = this.nodeById.get(nodeId);
    this.analytics.track('tree_expand', {
      nodeId,
      expanded: shouldExpand,
      level: node?.level ?? null
    });

    if (shouldExpand) {
      if (!isExpanded) {
        this.expandedIds.add(nodeId);
        this.expandedIds = new Set(this.expandedIds);
        this.updateVisibleNodes();
      }
    } else if (isExpanded) {
      this.expandedIds.delete(nodeId);
      this.expandedIds = new Set(this.expandedIds);
      this.updateVisibleNodes();
      if (this.focusedNodeId != null && !this.isVisible(this.focusedNodeId)) {
        this.focusNode(nodeId);
      }
    }
    // Emit state change for persistence
    this.expandedIdsChange.emit(this.expandedIds);
    this.cdr.markForCheck();
  }

  /**
   * Wird vom Kind ausgelöst: Fokuswechsel bei Pointer-Fokus.
   */
  onFocusRequest(nodeId: NodeId): void {
    this.focusNode(nodeId);
  }

  /**
   * TrackBy-Funktion für *ngFor.
   */
  trackByNodeId(_index: number, item: LeagueTreeNode): NodeId {
    return item.id;
  }

  /**
   * Prüft, ob ein Knoten expandiert ist.
   */
  isExpanded(nodeId: NodeId): boolean {
    return this.expandedIds.has(nodeId);
  }

  /**
   * Expandiert alle Knoten, die Kinder besitzen.
   */
  expandAll(): void {
    super.expandAll();
    this.expandedIdsChange.emit(this.expandedIds);
  }

  /**
   * Klappt alle Knoten ein.
   */
  collapseAll(): void {
    super.collapseAll();
    this.expandedIdsChange.emit(this.expandedIds);
  }

  /**
   * true, wenn alle expandierbaren Knoten expandiert sind.
   */
  isAllExpanded(): boolean {
    return super.isAllExpanded();
  }

  /**
   * Wird ausgelöst, wenn ein Knoten selektiert wurde.
   */
  selectNode(nodeId: NodeId): void {
    this.handleSelection(nodeId);
  }

  protected handleSelection(nodeId: NodeId): void {
    this.selectedId = nodeId;
    this.focusNode(nodeId);
    // Analytics: tree select
    this.analytics.track('tree_select', { nodeId });
    this.select.emit(nodeId);
  }
}

