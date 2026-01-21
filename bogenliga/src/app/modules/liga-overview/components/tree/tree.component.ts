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
 * Accessible tree component for rendering the league hierarchy.
 *
 * - Supports expand/collapse, selection and keyboard navigation (arrow keys, Enter, Space)
 * - Uses a roving tabindex for focus management
 * - Applies ARIA roles (tree, treeitem, group) and attributes (aria-expanded, aria-selected)
 *
 * Virtualisation is prepared but will only be enabled in later sprints.
 */
@Component({
  selector: 'bla-league-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeComponent extends AccessibleTreeBase implements OnChanges, AfterViewInit, OnDestroy {

/**
   * Input data: tree nodes (forest). The order corresponds to the visual order.
   */
  @Input()
  nodes: LeagueTreeNode[] = [];

/**
   * Optional preselected league ID.
   */
  @Input()
  selectedId: NodeId | null = null;

/**
   * Event: emitted when the user selects a node (Enter/Space or click).
   */
  @Output()
  readonly select = new EventEmitter<NodeId>();

/**
   * Event: emitted whenever the set of expanded nodes changes.
   */
  @Output()
  readonly expandedIdsChange = new EventEmitter<Set<NodeId>>();

/**
   * Optional: initial expanded node IDs used for state restoration.
   */
  @Input()
  initialExpandedIds: Set<NodeId> = new Set();

/**
   * Flag indicating whether initial expanded IDs have already been applied.
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
      // Apply initial state if present and not yet applied
      if (!this.initialStateApplied && this.initialExpandedIds.size > 0) {
        this.expandedIds = new Set(this.initialExpandedIds);
        this.initialStateApplied = true;
      } else {
        this.ensureRootsExpanded();
      }
      this.updateVisibleNodes();
      this.ensureFocusableNode();
      // If there is already a selection, expand its ancestor path
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
   * Keydown handler for roving tabindex and expand/collapse via keyboard.
   */
  @HostListener('keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    this.onKeydown(event);
  }

/**
   * Triggered from child node: toggles expand/collapse of a node.
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
   * Triggered from child node: focus change when pointer focus is requested.
   */
  onFocusRequest(nodeId: NodeId): void {
    this.focusNode(nodeId);
  }

/**
   * TrackBy function for *ngFor.
   */
  trackByNodeId(_index: number, item: LeagueTreeNode): NodeId {
    return item.id;
  }

/**
   * Checks whether a node is expanded.
   */
  isExpanded(nodeId: NodeId): boolean {
    return this.expandedIds.has(nodeId);
  }

/**
   * Expands all nodes that have children.
   */
  expandAll(): void {
    super.expandAll();
    this.expandedIdsChange.emit(this.expandedIds);
  }

/**
   * Expands all nodes only up to a maximum depth level (0-based).
   *
   * Example: maxLevel = 5 => levels 0..5 (6 levels total) are fully expanded,
   * deeper levels remain collapsed.
   */
  expandToLevel(maxLevel: number): void {
    const allExpandable = this.collectExpandableNodeIds(this.treeNodes);

    const limited = new Set<NodeId>();
    for (const id of allExpandable) {
      const node = this.nodeById.get(id);
      if (node && node.level <= maxLevel) {
        limited.add(id);
      }
    }

    this.expandedIds = limited;
    this.updateVisibleNodes();
    this.ensureFocusableNode();
    this.cdr.markForCheck();
    this.expandedIdsChange.emit(this.expandedIds);
  }

/**
   * Collapses all nodes.
   */
  collapseAll(): void {
    super.collapseAll();
    this.expandedIdsChange.emit(this.expandedIds);
  }

/**
   * Returns true if all expandable nodes are expanded.
   */
  isAllExpanded(): boolean {
    return super.isAllExpanded();
  }

/**
   * Returns true if all expandable nodes up to a maximum level are expanded.
   */
  isExpandedUpToLevel(maxLevel: number): boolean {
    const expandable = this.collectExpandableNodeIds(this.treeNodes);
    let hasCandidate = false;

    for (const id of expandable) {
      const node = this.nodeById.get(id);
      if (!node || node.level > maxLevel) {
        continue;
      }
      hasCandidate = true;
      if (!this.expandedIds.has(id)) {
        return false;
      }
    }

    return hasCandidate;
  }

/**
   * Triggered when a node is selected.
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

