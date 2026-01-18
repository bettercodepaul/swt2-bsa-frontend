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

// Deep hierarchy sample for expandToLevel / isExpandedUpToLevel tests
const DEEP_NODES: LeagueTreeNode[] = [
  {
    id: 1,
    name: 'L0',
    parentId: null,
    level: 0,
    children: [
      {
        id: 2,
        name: 'L1',
        parentId: 1,
        level: 1,
        children: [
          {
            id: 3,
            name: 'L2',
            parentId: 2,
            level: 2,
            children: [
              {
                id: 4,
                name: 'L3',
                parentId: 3,
                level: 3,
                children: [
                  {
                    id: 5,
                    name: 'L4',
                    parentId: 4,
                    level: 4,
                    children: [
                      {
                        id: 6,
                        name: 'L5',
                        parentId: 5,
                        level: 5,
                        children: [
                          {
                            id: 7,
                            name: 'L6',
                            parentId: 6,
                            level: 6,
                            children: [
                              {
                                id: 8,
                                name: 'L7',
                                parentId: 7,
                                level: 7,
                                children: []
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
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
    expect(fixture.nativeElement.querySelector('[data-node-id="11"]').not).toBeNull();
    expect(fixture.nativeElement.querySelector('[data-node-id="111"]').not).toBeNull();
  });

  it('should expand only nodes up to the given maxLevel in expandToLevel', () => {
    const deepFixture = TestBed.createComponent(TreeComponent);
    const deepComponent = deepFixture.componentInstance;
    deepComponent.nodes = JSON.parse(JSON.stringify(DEEP_NODES));
    deepFixture.detectChanges();

    const MAX_LEVEL = 4;
    deepComponent.collapseAll();
    deepComponent.expandToLevel(MAX_LEVEL);
    deepFixture.detectChanges();

    // nodes with level <= 4 are expanded
    [1, 2, 3, 4, 5].forEach(id => {
      expect(deepComponent.isExpanded(id as any)).toBeTrue();
    });

    // nodes deeper than level 4 are not expanded
    [6, 7, 8].forEach(id => {
      expect(deepComponent.isExpanded(id as any)).toBeFalse();
    });
  });

  it('should report all nodes up to maxLevel as expanded in isExpandedUpToLevel', () => {
    const deepFixture = TestBed.createComponent(TreeComponent);
    const deepComponent = deepFixture.componentInstance;
    deepComponent.nodes = JSON.parse(JSON.stringify(DEEP_NODES));
    deepFixture.detectChanges();

    const MAX_LEVEL = 4;
    deepComponent.expandToLevel(MAX_LEVEL);
    deepFixture.detectChanges();

    expect(deepComponent.isExpandedUpToLevel(MAX_LEVEL)).toBeTrue();

    // If we collapse everything, the check must fail
    deepComponent.collapseAll();
    deepFixture.detectChanges();

    expect(deepComponent.isExpandedUpToLevel(MAX_LEVEL)).toBeFalse();
  });

  it('should support keyboard navigation and selection', () => {
    const firstItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="1"]');
    const secondItemId = 11;

    // ArrowDown => move focus to first child
    firstItem.dispatchEvent(new KeyboardEvent('keydown', {key: 'ArrowDown', bubbles: true}));
    fixture.detectChanges();
    expect(component.focusedNodeId).toBe(secondItemId);

    // ArrowUp => back to parent
    const childItem: HTMLElement = fixture.nativeElement.querySelector('[data-node-id="11"]');
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
});


