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
import {LeagueTreeNode} from '@shared/models/tree-node';
import {AnalyticsService} from '@shared/services';

type NodeId = number;

interface VisibleNode {
  id: NodeId;
  node: LeagueTreeNode;
  parentId: NodeId | null;
}

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
export class TreeComponent implements OnChanges, AfterViewInit, OnDestroy {

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
   * Intern verwaltete expandierte Knoten.
   */
  expandedIds = new Set<NodeId>();

  /**
   * Aktuell fokusierter Knoten (Roving Tabindex).
   */
  focusedNodeId: NodeId | null = null;

  /**
   * Sichtbare Knoten (nach Expand-Status gefiltert) zur Tastaturnavigation.
   */
  private visibleNodes: VisibleNode[] = [];

  /**
   * Lookup-Tabellen für Eltern-Kind-Beziehungen.
   */
  private readonly nodeById = new Map<NodeId, LeagueTreeNode>();
  private readonly parentById = new Map<NodeId, NodeId | null>();

  /**
   * Flag, ob der Host bereits initial gerendert wurde (wichtig für Fokus-Setzung).
   */
  private viewInitialized = false;

  constructor(
    private readonly host: ElementRef<HTMLElement>,
    private readonly cdr: ChangeDetectorRef,
    private readonly analytics: AnalyticsService,
  ) {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['nodes']) {
      this.rebuildLookup(this.nodes);
      this.ensureRootsExpanded();
      this.updateVisibleNodes();
      this.ensureFocusableNode();
    }

    if (changes['selectedId'] && !changes['selectedId'].firstChange) {
      this.cdr.markForCheck();
    }
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;
    this.focusCurrentNode();
  }

  ngOnDestroy(): void {
    this.nodeById.clear();
    this.parentById.clear();
    this.visibleNodes = [];
  }

  /**
   * Keydown-Handler für Roving-Tabindex und Expand/Collapse via Tastatur.
   */
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    const source = event.target as HTMLElement;
    const idAttr = source?.getAttribute('data-node-id');
    if (!idAttr) {
      return;
    }

    const nodeId = Number(idAttr);
    const node = this.nodeById.get(nodeId);
    if (!node) {
      return;
    }

    switch (event.key) {
      case 'ArrowDown':
        this.focusNext(nodeId);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusPrevious(nodeId);
        event.preventDefault();
        break;
      case 'ArrowRight':
        this.handleArrowRight(node);
        event.preventDefault();
        break;
      case 'ArrowLeft':
        this.handleArrowLeft(node);
        event.preventDefault();
        break;
      case 'Enter':
      case ' ':
        this.selectNode(nodeId);
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * Wird vom Kind ausgelöst: toggelt Expand/Collapse eines Knotens.
   */
  onToggle(nodeId: NodeId, expand?: boolean): void {
    const isExpanded = this.expandedIds.has(nodeId);
    const shouldExpand = expand ?? !isExpanded;

    if (shouldExpand) {
      if (!isExpanded) {
        this.expandedIds.add(nodeId);
        this.expandedIds = new Set(this.expandedIds);
        this.updateVisibleNodes();
        this.trackExpand(nodeId, 'expand');
      }
    } else if (isExpanded) {
      this.expandedIds.delete(nodeId);
      this.expandedIds = new Set(this.expandedIds);
      this.updateVisibleNodes();
      if (this.focusedNodeId != null && !this.isVisible(this.focusedNodeId)) {
        this.focusNode(nodeId);
      }
      this.trackExpand(nodeId, 'collapse');
    }
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
   * Wird ausgelöst, wenn ein Knoten selektiert wurde.
   */
  selectNode(nodeId: NodeId): void {
    this.selectedId = nodeId;
    this.focusNode(nodeId);
    this.select.emit(nodeId);
    // Tracking der Selektion auf Komponentenebene vermeiden – erfolgt im Parent
  }

  /**
   * Expandiert den Pfad zu einem Knoten und markiert ihn.
   * 
   * Findet alle Eltern-Knoten bis zur Wurzel und expandiert sie,
   * damit der Zielknoten sichtbar wird. Setzt anschließend die Selektion.
   * 
   * @param nodeId Die ID des Zielknotens
   * @returns true, wenn der Knoten gefunden und expandiert wurde, sonst false
   */
  expandPathTo(nodeId: NodeId): boolean {
    if (!this.nodeById.has(nodeId)) {
      return false;
    }

    // Pfad zur Wurzel finden
    const pathToRoot: NodeId[] = [];
    let currentId: NodeId | null = nodeId;
    
    while (currentId != null) {
      const parent = this.parentById.get(currentId);
      if (parent != null) {
        pathToRoot.push(parent);
      }
      currentId = parent ?? null;
    }

    // Alle Eltern-Knoten expandieren
    let mutated = false;
    for (const parentId of pathToRoot) {
      if (!this.expandedIds.has(parentId)) {
        this.expandedIds.add(parentId);
        mutated = true;
      }
    }

    if (mutated) {
      this.expandedIds = new Set(this.expandedIds);
      this.updateVisibleNodes();
    }

    // Knoten selektieren und fokussieren
    this.selectNode(nodeId);
    this.cdr.markForCheck();
    
    return true;
  }

  /**
   * Fügt alle Knoten in Lookup-Tabellen ein.
   */
  private rebuildLookup(list: LeagueTreeNode[]): void {
    this.nodeById.clear();
    this.parentById.clear();
    const visit = (nodes: LeagueTreeNode[], parentId: NodeId | null) => {
      for (const node of nodes ?? []) {
        this.nodeById.set(node.id, node);
        this.parentById.set(node.id, parentId);
        if (Array.isArray(node.children) && node.children.length > 0) {
          visit(node.children, node.id);
        }
      }
    };
    visit(list, null);
    this.cleanupExpandedIds();
  }

  /**
   * Expandiert standardmäßig alle Wurzelknoten bei erstmaliger Bereitstellung von Daten.
   */
  private ensureRootsExpanded(): void {
    if (this.expandedIds.size > 0) {
      return;
    }
    let mutated = false;
    for (const node of this.nodes ?? []) {
      if (!this.expandedIds.has(node.id)) {
        this.expandedIds.add(node.id);
        mutated = true;
      }
    }
    if (mutated) {
      this.expandedIds = new Set(this.expandedIds);
    }
  }

  /**
   * Aktualisiert die Liste sichtbarer Knoten (flach).
   */
  private updateVisibleNodes(): void {
    const result: VisibleNode[] = [];
    const visit = (items: LeagueTreeNode[], parentId: NodeId | null) => {
      for (const node of items ?? []) {
        result.push({id: node.id, node, parentId});
        if (node.children?.length && this.expandedIds.has(node.id)) {
          visit(node.children, node.id);
        }
      }
    };
    visit(this.nodes ?? [], null);
    this.visibleNodes = result;
  }

  /**
   * Stellt sicher, dass mindestens ein Knoten fokusierbar ist.
   */
  private ensureFocusableNode(): void {
    if (this.visibleNodes.length === 0) {
      this.focusedNodeId = null;
      return;
    }

    if (this.focusedNodeId == null || !this.isVisible(this.focusedNodeId)) {
      this.focusedNodeId = this.visibleNodes[0].id;
    }
  }

  /**
   * Setzt den Fokus auf einen Knoten (inkl. DOM-Fokus, sobald View bereit).
   */
  private focusNode(nodeId: NodeId): void {
    if (!this.nodeById.has(nodeId)) {
      return;
    }
    this.focusedNodeId = nodeId;
    this.cdr.markForCheck();
    this.focusCurrentNode();
  }

  /**
   * Fokussiert das aktuell gesetzte Fokusziel im DOM.
   */
  private focusCurrentNode(): void {
    if (!this.viewInitialized || this.focusedNodeId == null) {
      return;
    }
    this.runAfterRender(() => {
      const element = this.host.nativeElement.querySelector<HTMLElement>(`[data-node-id="${this.focusedNodeId}"]`);
      element?.focus();
    });
  }

  private trackExpand(nodeId: NodeId, state: 'expand'|'collapse'): void {
    const node = this.nodeById.get(nodeId);
    this.analytics.track('tree_expand', {
      nodeId,
      state,
      level: node?.level ?? null,
    });
  }

  private focusNode(nodeId: NodeId): void {
    const index = this.visibleNodes.findIndex((item) => item.id === currentId);
    if (index >= 0 && index < this.visibleNodes.length - 1) {
      this.focusNode(this.visibleNodes[index + 1].id);
    }
  }

  private focusPrevious(currentId: NodeId): void {
    const index = this.visibleNodes.findIndex((item) => item.id === currentId);
    if (index > 0) {
      this.focusNode(this.visibleNodes[index - 1].id);
    }
  }

  private handleArrowRight(node: LeagueTreeNode): void {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    if (hasChildren) {
      if (!this.isExpanded(node.id)) {
        this.onToggle(node.id, true);
      } else {
        const firstChild = node.children[0];
        if (firstChild) {
          this.focusNode(firstChild.id);
        }
      }
    }
  }

  private handleArrowLeft(node: LeagueTreeNode): void {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    if (hasChildren && this.isExpanded(node.id)) {
      this.onToggle(node.id, false);
      return;
    }
    const parentId = this.parentById.get(node.id);
    if (parentId != null) {
      this.focusNode(parentId);
    }
  }

  private isVisible(nodeId: NodeId): boolean {
    return this.visibleNodes.some((item) => item.id === nodeId);
  }

  private runAfterRender(callback: () => void): void {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(callback);
    } else {
      Promise.resolve().then(callback);
    }
  }

  private cleanupExpandedIds(): void {
    if (this.expandedIds.size === 0) {
      return;
    }
    let mutated = false;
    for (const id of Array.from(this.expandedIds)) {
      if (!this.nodeById.has(id)) {
        this.expandedIds.delete(id);
        mutated = true;
      }
    }
    if (mutated) {
      this.expandedIds = new Set(this.expandedIds);
    }
  }
}


