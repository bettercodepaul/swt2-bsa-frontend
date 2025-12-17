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


