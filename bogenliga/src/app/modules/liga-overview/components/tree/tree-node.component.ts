import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  EventEmitter,
  HostBinding,
  HostListener,
  Input,
  OnChanges,
  Output,
  SimpleChanges
} from '@angular/core';
import { LeagueTreeNode } from '@shared/models/tree-node';

type NodeId = number;

/**
 * Repräsentiert einen einzelnen Tree-Knoten inklusive seiner Kinder.
 *
 * Verwaltet Darstellungslogik (Indentierung, Zustandsklassen) und
 * delegiert Interaktionen an das Tree-Parent-Element.
 */
@Component({
  selector: 'bla-league-tree-node',
  templateUrl: './tree-node.component.html',
  styleUrls: ['./tree-node.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeNodeComponent implements OnChanges {

  @Input()
  node!: LeagueTreeNode;

  @Input()
  expanded = false;

  @Input()
  expandedIds!: Set<NodeId>;

  @Input()
  focusedId: NodeId | null = null;

  @Input()
  selectedId: NodeId | null = null;

  @Output()
  readonly toggle = new EventEmitter<NodeId>();

  @Output()
  readonly focusRequest = new EventEmitter<NodeId>();

  @Output()
  readonly selectRequest = new EventEmitter<NodeId>();

  /**
   * Event: Wird ausgelöst wenn mehr Kinder geladen werden sollen (Pagination).
   */
  @Output()
  readonly loadMoreRequest = new EventEmitter<NodeId>();

  readonly indentStepPx = 20;

  constructor(private readonly cdr: ChangeDetectorRef) {
  }

  @HostBinding('attr.role')
  readonly role = 'treeitem';

  @HostBinding('class.bla-league-tree__item')
  readonly baseClass = true;

  @HostBinding('attr.data-node-id')
  get dataNodeId(): string {
    return String(this.node?.id ?? '');
  }

  @HostBinding('attr.aria-level')
  get ariaLevel(): number {
    return (this.node?.level ?? 0) + 1;
  }

  @HostBinding('attr.aria-expanded')
  get ariaExpanded(): boolean | null {
    if (!this.hasChildren) {
      return null;
    }
    return this.expanded;
  }

  @HostBinding('attr.aria-selected')
  get ariaSelected(): boolean {
    return this.isSelected;
  }

  /**
   * Accessible Name für Screenreader: muss am treeitem selbst hängen
   * (nicht an einem child mit role="presentation").
   */
  @HostBinding('attr.aria-label')
  get ariaLabel(): string | null {
    return this.node?.name ?? null;
  }

  /**
   * Verknüpft treeitem mit seiner (sichtbaren) group.
   * Nur setzen, wenn die group existiert (expanded), sonst gibt es A11y-Tool-Warnungen.
   */
  @HostBinding('attr.aria-controls')
  get ariaControls(): string | null {
    return this.hasChildren && this.expanded ? `league-tree-group-${this.node.id}` : null;
  }

  @HostBinding('attr.tabindex')
  get tabIndex(): number {
    return this.isFocused ? 0 : -1;
  }

  @HostBinding('class.bla-league-tree__item--selected')
  get selectedClass(): boolean {
    return this.isSelected;
  }

  @HostBinding('class.bla-league-tree__item--expanded')
  get expandedClass(): boolean {
    return this.expanded;
  }

  @HostBinding('class.bla-league-tree__item--focused')
  get focusedClass(): boolean {
    return this.isFocused;
  }

  @HostBinding('class.bla-league-tree__item--has-children')
  get hasChildrenClass(): boolean {
    return this.hasChildren;
  }

  @HostBinding('class.bla-league-tree__item--root')
  get rootClass(): boolean {
    return (this.node?.level ?? 0) === 0;
  }

  @HostBinding('attr.data-level')
  get dataLevel(): number {
    return this.node?.level ?? 0;
  }

  get isFocused(): boolean {
    return this.focusedId === this.node?.id;
  }

  get isSelected(): boolean {
    return this.selectedId === this.node?.id;
  }

  get hasChildren(): boolean {
    // Check for actual children OR lazyState (children not yet loaded) OR childCount
    const hasActualChildren = Array.isArray(this.node?.children) && this.node.children.length > 0;
    const hasLazyChildren = this.node?.lazyState != null || (this.node?.childCount ?? 0) > 0;
    return hasActualChildren || hasLazyChildren;
  }

  get children(): LeagueTreeNode[] {
    // For lazy loading: only return children if they've been loaded
    if (this.node?.lazyState && !this.node.lazyState.childrenLoaded) {
      return [];
    }
    return this.node?.children ?? [];
  }

  get paddingLeft(): number {
    // Clamp indent to avoid excessive indentation on very deep trees (esp. on mobile)
    return Math.min((this.node?.level ?? 0) * this.indentStepPx, 96);
  }

  trackByNodeId(_index: number, item: LeagueTreeNode): number {
    return item.id;
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['expanded']) {
      console.log(`[TreeNode] ${this.node?.name} expanded changed:`, changes['expanded'].currentValue);
    }
    if (changes['focusedId'] || changes['selectedId'] || changes['expanded'] || changes['node']) {
      this.cdr.markForCheck();
    }
  }

  onToggleClick(event: MouseEvent): void {
    event.stopPropagation();
    // Fokus nach dem Klicken auf den Toggle sicher auf dem treeitem behalten
    this.focusRequest.emit(this.node.id);
    this.toggle.emit(this.node.id);
  }

  onItemClick(): void {
    this.selectRequest.emit(this.node.id);
  }

  @HostListener('focus')
  onFocus(): void {
    this.focusRequest.emit(this.node.id);
  }

  /**
   * Prüft ob Kinder gerade geladen werden.
   */
  get isChildrenLoading(): boolean {
    return this.node?.lazyState?.childrenLoading ?? false;
  }

  /**
   * Prüft ob weitere Kinder nachgeladen werden können.
   */
  get showLoadMore(): boolean {
    return this.expanded && (this.node?.lazyState?.hasMoreChildren ?? false);
  }

  /**
   * Handler für 'Mehr laden' Button.
   */
  onLoadMoreClick(event: MouseEvent): void {
    event.stopPropagation();
    this.loadMoreRequest.emit(this.node.id);
  }
}
