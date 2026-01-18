import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {TreeComponent} from './tree.component';
import {TreeNodeComponent} from './tree-node.component';
import {LeagueTreeNode} from '@shared/models/tree-node';
import {TranslateModule} from '@ngx-translate/core';

const SAMPLE_NODES: LeagueTreeNode[] = [
  {
    id: 1,
    name: 'Bundesliga',
    parentId: null,
    level: 0,
    children: [
      {
        id: 11,
        name: 'Regionalliga',
        parentId: 1,
        level: 1,
        children: [
          {
            id: 111,
            name: 'Bezirksliga',
            parentId: 11,
            level: 2,
            children: []
          }
        ]
      }
    ]
  },
  {
    id: 2,
    name: 'Landesliga',
    parentId: null,
    level: 0,
    children: []
  }
];

describe('TreeComponent', () => {
  let fixture: ComponentFixture<TreeComponent>;
  let component: TreeComponent;
  let selectEmitSpy: jasmine.Spy;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeComponent, TreeNodeComponent],
      imports: [TranslateModule.forRoot()]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeComponent);
    component = fixture.componentInstance;
    component.nodes = JSON.parse(JSON.stringify(SAMPLE_NODES));
    selectEmitSpy = spyOn(component.select, 'emit');
    fixture.detectChanges();
  });

  it('should render visible nodes', () => {
    const treeItems = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
    expect(treeItems.length).toBeGreaterThan(0);
  });

  it('should collapse and expand nodes on toggle click', () => {
    // First ensure node is expanded
    component.expandAll();
    fixture.detectChanges();
    expect(component.isExpanded(1)).toBe(true);

    const toggleButton: HTMLButtonElement | null =
      fixture.nativeElement.querySelector('.bla-league-tree__toggle');
    expect(toggleButton).not.toBeNull();

    // Collapse
    toggleButton!.click();
    fixture.detectChanges();
    expect(component.isExpanded(1)).toBe(false);
    let child = fixture.nativeElement.querySelector('[data-node-id="11"]');
    expect(child).toBeNull();

    // Expand again
    toggleButton!.click();
    fixture.detectChanges();
    expect(component.isExpanded(1)).toBe(true);
    child = fixture.nativeElement.querySelector('[data-node-id="11"]');
    expect(child).not.toBeNull();
  });

  it('should emit selection events on click', () => {
    selectEmitSpy.calls.reset();
    const label: HTMLElement = fixture.nativeElement.querySelector('.bla-league-tree__label');
    label.click();
    expect(selectEmitSpy).toHaveBeenCalledWith(1);
  });

  it('should collapseAll to only show root nodes', () => {
    component.collapseAll();
    fixture.detectChanges();

    expect(component.expandedIds.size).toBe(0);
    expect(fixture.nativeElement.querySelector('[data-node-id="11"]')).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-node-id="111"]')).toBeNull();
  });

  it('should expandAll to show all nodes', () => {
    component.collapseAll();
    fixture.detectChanges();

    component.expandAll();
    fixture.detectChanges();

    expect(component.isExpanded(1)).toBe(true);
    expect(component.isExpanded(11)).toBe(true);
    expect(fixture.nativeElement.querySelector('[data-node-id="11"]')).not.toBeNull();
    expect(fixture.nativeElement.querySelector('[data-node-id="111"]')).not.toBeNull();
  });

  it('should support keyboard navigation and selection', () => {
    // First expand to make children visible
    component.expandAll();
    fixture.detectChanges();

    const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
    expect(firstItem).not.toBeNull();
    const secondItemId = 11;

    // ArrowDown => move focus to first child
    firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
    fixture.detectChanges();
    expect(component.focusedNodeId).toBe(secondItemId);

    // ArrowUp => back to parent
    const childItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="11"]');
    expect(childItem).not.toBeNull();
    childItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}));
    fixture.detectChanges();
    expect(component.focusedNodeId).toBe(1);

    selectEmitSpy.calls.reset();
    firstItem.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    }));
    expect(selectEmitSpy).toHaveBeenCalledWith(1);
  });

  describe('initialExpandedIds', () => {
    it('should initialize with provided expanded IDs', () => {
      const initialExpanded = new Set([1, 11]);
      component.initialExpandedIds = initialExpanded;
      component.nodes = JSON.parse(JSON.stringify(SAMPLE_NODES));
      fixture.detectChanges();

      expect(component.isExpanded(1)).toBe(true);
      expect(component.isExpanded(11)).toBe(true);
    });

    it('should not apply initialExpandedIds if already applied', () => {
      const initialExpanded = new Set([1]);
      component.initialExpandedIds = initialExpanded;
      component.nodes = JSON.parse(JSON.stringify(SAMPLE_NODES));
      fixture.detectChanges();

      expect(component.isExpanded(1)).toBe(true);

      // Change initialExpandedIds - should not apply again because initialStateApplied is true
      component.initialExpandedIds = new Set([11]);
      // Simuliere ngOnChanges mit initialExpandedIds Change
      component.ngOnChanges({ 
        initialExpandedIds: { 
          previousValue: initialExpanded, 
          currentValue: new Set([11]), 
          firstChange: false, 
          isFirstChange: () => false 
        } 
      });
      fixture.detectChanges();

      // Should still have 1 expanded, not 11 (because initialStateApplied is already true)
      expect(component.isExpanded(1)).toBe(true);
      expect(component.isExpanded(11)).toBe(false);
    });
  });

  describe('Keyboard Navigation - Extended', () => {
    it('should expand node on ArrowRight', () => {
      component.collapseAll();
      fixture.detectChanges();

      const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
      expect(component.isExpanded(1)).toBe(false);

      firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowRight', bubbles: true}));
      fixture.detectChanges();

      expect(component.isExpanded(1)).toBe(true);
    });

    it('should collapse node on ArrowLeft when expanded', () => {
      component.expandAll();
      fixture.detectChanges();
      expect(component.isExpanded(1)).toBe(true);

      const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
      firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowLeft', bubbles: true}));
      fixture.detectChanges();

      expect(component.isExpanded(1)).toBe(false);
    });

    it('should select node on Space key', () => {
      selectEmitSpy.calls.reset();
      const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');

      firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: ' ', bubbles: true}));
      fixture.detectChanges();

      expect(selectEmitSpy).toHaveBeenCalledWith(1);
    });

    it('should select node on Enter key', () => {
      selectEmitSpy.calls.reset();
      const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');

      firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'Enter', bubbles: true}));
      fixture.detectChanges();

      expect(selectEmitSpy).toHaveBeenCalledWith(1);
    });

    it('should navigate with ArrowDown through multiple nodes', () => {
      component.expandAll();
      fixture.detectChanges();

      const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
      firstItem.focus();
      firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
      fixture.detectChanges();

      expect(component.focusedNodeId).toBe(11);

      const secondItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="11"]');
      secondItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
      fixture.detectChanges();

      expect(component.focusedNodeId).toBe(111);
    });

    it('should navigate with ArrowUp through multiple nodes', () => {
      component.expandAll();
      fixture.detectChanges();

      const thirdItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="111"]');
      thirdItem.focus();
      thirdItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}));
      fixture.detectChanges();

      expect(component.focusedNodeId).toBe(11);

      const secondItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="11"]');
      secondItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowUp', bubbles: true}));
      fixture.detectChanges();

      expect(component.focusedNodeId).toBe(1);
    });
  });

  describe('Roving Tabindex', () => {
    it('should set tabindex to 0 for focused node', () => {
      component.focusedNodeId = 1;
      fixture.detectChanges();

      const focusedItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
      expect(focusedItem.getAttribute('tabindex')).toBe('0');
    });

    it('should set tabindex to -1 for non-focused nodes', () => {
      component.focusedNodeId = 1;
      fixture.detectChanges();

      const nonFocusedItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="2"]');
      expect(nonFocusedItem.getAttribute('tabindex')).toBe('-1');
    });

    it('should update tabindex when focus changes', () => {
      component.focusedNodeId = 1;
      fixture.detectChanges();

      let firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
      expect(firstItem.getAttribute('tabindex')).toBe('0');

      component.focusedNodeId = 2;
      fixture.detectChanges();

      firstItem = fixture.nativeElement.querySelector('[data-node-id="1"]');
      const secondItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="2"]');
      expect(firstItem.getAttribute('tabindex')).toBe('-1');
      expect(secondItem.getAttribute('tabindex')).toBe('0');
    });
  });

  describe('Edge Cases', () => {
    it('should handle empty nodes array', () => {
      component.nodes = [];
      fixture.detectChanges();

      const treeItems = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
      expect(treeItems.length).toBe(0);
      expect(component.expandedIds.size).toBe(0);
    });

    it('should handle nodes with empty children array', () => {
      const nodesWithEmptyChildren: LeagueTreeNode[] = [
        { id: 1, name: 'Liga', level: 0, parentId: null, children: [] }
      ];
      component.nodes = nodesWithEmptyChildren;
      fixture.detectChanges();

      const treeItems = fixture.nativeElement.querySelectorAll('[role="treeitem"]');
      expect(treeItems.length).toBe(1);
      expect(component.isExpanded(1)).toBe(false);
    });

    it('should handle complex hierarchies with multiple levels', () => {
      const complexNodes: LeagueTreeNode[] = [
        {
          id: 1,
          name: 'Level 0',
          level: 0,
          parentId: null,
          children: [
            {
              id: 2,
              name: 'Level 1',
              level: 1,
              parentId: 1,
              children: [
                {
                  id: 3,
                  name: 'Level 2',
                  level: 2,
                  parentId: 2,
                  children: [
                    {
                      id: 4,
                      name: 'Level 3',
                      level: 3,
                      parentId: 3,
                      children: []
                    }
                  ]
                }
              ]
            }
          ]
        }
      ];

      component.nodes = complexNodes;
      component.expandAll();
      fixture.detectChanges();

      expect(component.isExpanded(1)).toBe(true);
      expect(component.isExpanded(2)).toBe(true);
      expect(component.isExpanded(3)).toBe(true);
    });
  });

  describe('expandedIdsChange Output', () => {
    it('should emit expandedIdsChange when node is expanded', () => {
      spyOn(component.expandedIdsChange, 'emit');
      component.collapseAll();
      fixture.detectChanges();

      component.onToggle(1, true);
      fixture.detectChanges();

      expect(component.expandedIdsChange.emit).toHaveBeenCalled();
      const emittedSet = (component.expandedIdsChange.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedSet.has(1)).toBe(true);
    });

    it('should emit expandedIdsChange when node is collapsed', () => {
      spyOn(component.expandedIdsChange, 'emit');
      component.expandAll();
      fixture.detectChanges();

      component.onToggle(1, false);
      fixture.detectChanges();

      expect(component.expandedIdsChange.emit).toHaveBeenCalled();
      const emittedSet = (component.expandedIdsChange.emit as jasmine.Spy).calls.mostRecent().args[0];
      expect(emittedSet.has(1)).toBe(false);
    });

    it('should emit expandedIdsChange on expandAll', () => {
      spyOn(component.expandedIdsChange, 'emit');
      component.collapseAll();
      fixture.detectChanges();

      component.expandAll();
      fixture.detectChanges();

      expect(component.expandedIdsChange.emit).toHaveBeenCalled();
    });

    it('should emit expandedIdsChange on collapseAll', () => {
      spyOn(component.expandedIdsChange, 'emit');
      component.expandAll();
      fixture.detectChanges();

      component.collapseAll();
      fixture.detectChanges();

      expect(component.expandedIdsChange.emit).toHaveBeenCalled();
    });
  });
});


