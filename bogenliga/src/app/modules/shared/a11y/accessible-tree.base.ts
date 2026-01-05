import {ChangeDetectorRef, ElementRef} from '@angular/core';
import {LeagueTreeNode} from '@shared/models/tree-node';

export type NodeId = number;

interface VisibleNode {
  id: NodeId;
  node: LeagueTreeNode;
  parentId: NodeId | null;
}

/**
 * Accessibility-Basis für League-Tree-Strukturen.
 *
 * Kapselt:
 * - Expand-/Collapse-State (expandedIds)
 * - Berechnung der sichtbaren Knoten (visibleNodes)
 * - Fokusverwaltung (Roving-Tabindex) und Tastaturnavigation
 *
 * Die konkrete Komponente (z. B. TreeComponent) ist verantwortlich für:
 * - Bereitstellung der Root-Knoten (treeNodes)
 * - Emission von Events (select, expandedIdsChange)
 * - Analytics-Tracking
 */
export abstract class AccessibleTreeBase {

  /**
   * Intern verwaltete expandierte Knoten.
   * Wird absichtlich public gehalten, da bestehende Tests direkt darauf zugreifen.
   */
  public expandedIds = new Set<NodeId>();

  /**
   * Aktuell fokusierter Knoten (Roving Tabindex).
   * Ebenfalls public für Tests.
   */
  public focusedNodeId: NodeId | null = null;

  /**
   * Sichtbare Knoten (nach Expand-Status gefiltert) zur Tastaturnavigation.
   */
  protected visibleNodes: VisibleNode[] = [];

  /**
   * Lookup-Tabellen für Eltern-Kind-Beziehungen.
   */
  protected readonly nodeById = new Map<NodeId, LeagueTreeNode>();
  protected readonly parentById = new Map<NodeId, NodeId | null>();

  /**
   * Flag, ob der Host bereits initial gerendert wurde (wichtig für Fokus-Setzung).
   */
  protected viewInitialized = false;

  protected constructor(
    protected readonly host: ElementRef<HTMLElement>,
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

  /**
   * Von der konkreten Komponente bereitzustellende Root-Knoten.
   */
  protected abstract get treeNodes(): LeagueTreeNode[];

  /**
   * Keydown-Handler für Roving-Tabindex und Expand/Collapse via Tastatur.
   *
   * Soll von der konkreten Komponente über einen @HostListener aufgerufen werden.
   */
  public onKeydown(event: KeyboardEvent): void {
    const target = event.target as HTMLElement | null;
    const source = (target?.closest?.('[data-node-id]') as HTMLElement | null) ?? target;
    const idAttr = source?.getAttribute('data-node-id');
    if (!idAttr) {
      return;
    }

    const nodeId = Number(idAttr) as NodeId;
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
        this.handleSelection(nodeId);
        event.preventDefault();
        break;
      default:
        break;
    }
  }

  /**
   * Muss von der konkreten Komponente implementiert werden, um Selektion abzubilden
   * (z. B. Analytics + EventEmitter).
   */
  protected abstract handleSelection(nodeId: NodeId): void;

  /**
   * Muss von der konkreten Komponente implementiert werden, um Expand/Collapse abzubilden
   * (inkl. Analytics + EventEmitter).
   */
  protected abstract handleToggle(nodeId: NodeId, expand?: boolean): void;

  /**
   * Prüft, ob ein Knoten expandiert ist.
   */
  public isExpanded(nodeId: NodeId): boolean {
    return this.expandedIds.has(nodeId);
  }

  /**
   * Expandiert alle Knoten, die Kinder besitzen.
   */
  public expandAll(): void {
    const allExpandable = this.collectExpandableNodeIds(this.treeNodes);
    this.expandedIds = new Set(allExpandable);
    this.updateVisibleNodes();
    this.ensureFocusableNode();
    this.cdr.markForCheck();
  }

  /**
   * Klappt alle Knoten ein.
   */
  public collapseAll(): void {
    this.expandedIds = new Set<NodeId>();
    this.updateVisibleNodes();
    this.ensureFocusableNode();

    // Falls Fokus nach dem Einklappen nicht mehr sichtbar ist, auf erstes sichtbares Element setzen
    if (this.focusedNodeId != null && !this.isVisible(this.focusedNodeId) && this.visibleNodes.length > 0) {
      this.focusNode(this.visibleNodes[0].id);
    }

    this.cdr.markForCheck();
  }

  /**
   * true, wenn alle expandierbaren Knoten expandiert sind.
   */
  public isAllExpanded(): boolean {
    const expandable = this.collectExpandableNodeIds(this.treeNodes);
    if (expandable.size === 0) {
      return false;
    }
    for (const id of expandable) {
      if (!this.expandedIds.has(id)) {
        return false;
      }
    }
    return true;
  }

  /**
   * Expandiert den Pfad zu einem Knoten und markiert ihn.
   *
   * Findet alle Eltern-Knoten bis zur Wurzel und expandiert sie,
   * damit der Zielknoten sichtbar wird. Delegiert anschließende Selektion
   * an handleSelection().
   *
   * @param nodeId Die ID des Zielknotens
   * @returns true, wenn der Knoten gefunden und expandiert wurde, sonst false
   */
  public expandPathTo(nodeId: NodeId): boolean {
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
    this.handleSelection(nodeId);
    this.cdr.markForCheck();

    return true;
  }

  /**
   * Fügt alle Knoten in Lookup-Tabellen ein.
   */
  protected rebuildLookup(list: LeagueTreeNode[]): void {
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
   * Sammelt alle Knoten-IDs, die Kinder besitzen (also expandierbar sind).
   */
  protected collectExpandableNodeIds(nodes: LeagueTreeNode[]): Set<NodeId> {
    const result = new Set<NodeId>();
    const visit = (items: LeagueTreeNode[]) => {
      for (const node of items ?? []) {
        if (Array.isArray(node.children) && node.children.length > 0) {
          result.add(node.id);
          visit(node.children);
        }
      }
    };
    visit(nodes ?? []);
    return result;
  }

  /**
   * Expandiert standardmäßig alle Wurzelknoten bei erstmaliger Bereitstellung von Daten.
   */
  protected ensureRootsExpanded(): void {
    if (this.expandedIds.size > 0) {
      return;
    }
    let mutated = false;
    for (const node of this.treeNodes ?? []) {
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
  protected updateVisibleNodes(): void {
    const result: VisibleNode[] = [];
    const visit = (items: LeagueTreeNode[], parentId: NodeId | null) => {
      for (const node of items ?? []) {
        result.push({id: node.id, node, parentId});
        if (node.children?.length && this.expandedIds.has(node.id)) {
          visit(node.children, node.id);
        }
      }
    };
    visit(this.treeNodes ?? [], null);
    this.visibleNodes = result;
  }

  /**
   * Stellt sicher, dass mindestens ein Knoten fokusierbar ist.
   */
  protected ensureFocusableNode(): void {
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
  protected focusNode(nodeId: NodeId): void {
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
  protected focusCurrentNode(): void {
    if (!this.viewInitialized || this.focusedNodeId == null) {
      return;
    }
    this.runAfterRender(() => {
      const element = this.host.nativeElement.querySelector<HTMLElement>(`[data-node-id="${this.focusedNodeId}"]`);
      element?.focus();
    });
  }

  protected focusNext(currentId: NodeId): void {
    const index = this.visibleNodes.findIndex((item) => item.id === currentId);
    if (index >= 0 && index < this.visibleNodes.length - 1) {
      this.focusNode(this.visibleNodes[index + 1].id);
    }
  }

  protected focusPrevious(currentId: NodeId): void {
    const index = this.visibleNodes.findIndex((item) => item.id === currentId);
    if (index > 0) {
      this.focusNode(this.visibleNodes[index - 1].id);
    }
  }

  protected handleArrowRight(node: LeagueTreeNode): void {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    if (hasChildren) {
      if (!this.isExpanded(node.id)) {
        this.handleToggle(node.id, true);
      } else {
        const firstChild = node.children[0];
        if (firstChild) {
          this.focusNode(firstChild.id);
        }
      }
    }
  }

  protected handleArrowLeft(node: LeagueTreeNode): void {
    const hasChildren = Array.isArray(node.children) && node.children.length > 0;
    if (hasChildren && this.isExpanded(node.id)) {
      this.handleToggle(node.id, false);
      return;
    }
    const parentId = this.parentById.get(node.id);
    if (parentId != null) {
      this.focusNode(parentId);
    }
  }

  protected isVisible(nodeId: NodeId): boolean {
    return this.visibleNodes.some((item) => item.id === nodeId);
  }

  protected runAfterRender(callback: () => void): void {
    if (typeof queueMicrotask === 'function') {
      queueMicrotask(callback);
    } else {
      Promise.resolve().then(callback);
    }
  }

  protected cleanupExpandedIds(): void {
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

  /**
   * Expandiert alle Vorfahren eines Knotens, sodass er sichtbar wird.
   */
  protected expandAncestors(nodeId: NodeId): void {
    if (!this.nodeById.has(nodeId)) {
      return;
    }
    let current: NodeId | null = nodeId;
    let mutated = false;
    while (current != null) {
      const parent = this.parentById.get(current);
      if (parent == null) {
        break;
      }
      if (!this.expandedIds.has(parent)) {
        this.expandedIds.add(parent);
        mutated = true;
      }
      current = parent;
    }
    if (mutated) {
      this.expandedIds = new Set(this.expandedIds);
      this.updateVisibleNodes();
      this.ensureFocusableNode();
    }
  }

  /**
   * Markiert die View als initialisiert (soll in ngAfterViewInit der Komponente aufgerufen werden).
   */
  public markViewInitialized(): void {
    this.viewInitialized = true;
  }

  /**
   * Bereinigt interne Strukturen (soll in ngOnDestroy aufgerufen werden).
   */
  public cleanupTreeState(): void {
    this.nodeById.clear();
    this.parentById.clear();
    this.visibleNodes = [];
  }
}
