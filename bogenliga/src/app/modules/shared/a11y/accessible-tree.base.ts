import {ChangeDetectorRef, ElementRef} from '@angular/core';
import {LeagueTreeNode} from '@shared/models/tree-node';

export type NodeId = number;

interface VisibleNode {
  id: NodeId;
  node: LeagueTreeNode;
  parentId: NodeId | null;
}

/**
 * Accessibility base for league tree structures.
 *
 * Encapsulates:
 * - expand/collapse state (expandedIds)
 * - computation of visible nodes (visibleNodes)
 * - focus management (roving tabindex) and keyboard navigation
 *
 * The concrete component (e.g. TreeComponent) is responsible for:
 * - providing the root nodes (treeNodes)
 * - emitting events (select, expandedIdsChange)
 * - analytics tracking
 */
export abstract class AccessibleTreeBase {

/**
   * Internally managed expanded node IDs.
   * Intentionally kept public, because existing tests access it directly.
   */
  public expandedIds = new Set<NodeId>();

/**
   * Currently focused node (roving tabindex).
   * Also public for tests.
   */
  public focusedNodeId: NodeId | null = null;

/**
   * Visible nodes (filtered by expand state) used for keyboard navigation.
   */
  protected visibleNodes: VisibleNode[] = [];

/**
   * Lookup tables for parent/child relationships.
   */
  protected readonly nodeById = new Map<NodeId, LeagueTreeNode>();
  protected readonly parentById = new Map<NodeId, NodeId | null>();

/**
   * Flag indicating whether the host view has been initially rendered (important for focus handling).
   */
  protected viewInitialized = false;

  protected constructor(
    protected readonly host: ElementRef<HTMLElement>,
    protected readonly cdr: ChangeDetectorRef,
  ) {
  }

/**
   * Root nodes that must be provided by the concrete component.
   */
  protected abstract get treeNodes(): LeagueTreeNode[];

/**
   * Keydown handler for roving tabindex and expand/collapse via keyboard.
   *
   * Should be called by the concrete component via a @HostListener.
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
   * Must be implemented by the concrete component to represent selection
   * (e.g. analytics + EventEmitter).
   */
  protected abstract handleSelection(nodeId: NodeId): void;

/**
   * Must be implemented by the concrete component to represent expand/collapse
   * (including analytics + EventEmitter).
   */
  protected abstract handleToggle(nodeId: NodeId, expand?: boolean): void;

/**
   * Checks whether a node is expanded.
   */
  public isExpanded(nodeId: NodeId): boolean {
    return this.expandedIds.has(nodeId);
  }

/**
   * Expands all nodes that have children.
   */
  public expandAll(): void {
    const allExpandable = this.collectExpandableNodeIds(this.treeNodes);
    this.expandedIds = new Set(allExpandable);
    this.updateVisibleNodes();
    this.ensureFocusableNode();
    this.cdr.markForCheck();
  }

/**
   * Collapses all nodes.
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
   * Returns true if all expandable nodes are expanded.
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
   * Expands the path to a node and marks it as selected.
   *
   * Finds all parent nodes up to the root and expands them
   * so that the target node becomes visible. Delegates final selection
   * to handleSelection().
   *
   * @param nodeId The ID of the target node
   * @returns true if the node was found and expanded, otherwise false
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
   * Inserts all nodes into the lookup tables.
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
   * Collects all node IDs that have children (i.e. can be expanded).
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
   * By default expands all root nodes when data is provided for the first time.
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
   * Updates the list of visible nodes (flattened sequence).
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
   * Ensures that at least one node is focusable.
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
   * Sets focus to a node (including DOM focus once the view is ready).
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
   * Focuses the currently targeted node in the DOM.
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
   * Expands all ancestors of a node so that it becomes visible.
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
   * Marks the view as initialized (should be called from the component's ngAfterViewInit).
   */
  public markViewInitialized(): void {
    this.viewInitialized = true;
  }

/**
   * Cleans up internal structures (should be called from ngOnDestroy).
   */
  public cleanupTreeState(): void {
    this.nodeById.clear();
    this.parentById.clear();
    this.visibleNodes = [];
  }
}
