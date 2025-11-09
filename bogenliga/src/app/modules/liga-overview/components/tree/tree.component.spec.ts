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
        children: []
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
    spyOn(component.select, 'emit');
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
    expect(component.isExpanded(1)).toBeFalse();
    let child = fixture.nativeElement.querySelector('[data-node-id="11"]');
    expect(child).toBeNull();

    // Expand again
    toggleButton!.click();
    fixture.detectChanges();
    expect(component.isExpanded(1)).toBeTrue();
    child = fixture.nativeElement.querySelector('[data-node-id="11"]');
    expect(child).not.toBeNull();
  });

  it('should emit selection events on click', () => {
    component.select.emit.calls.reset();
    const label: HTMLElement = fixture.nativeElement.querySelector('.bla-league-tree__label');
    label.click();
    expect(component.select.emit).toHaveBeenCalledWith(1);
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

    component.select.emit.calls.reset();
    firstItem.dispatchEvent(new KeyboardEvent('keydown', {
      key: 'Enter',
      bubbles: true
    }));
    expect(component.select.emit).toHaveBeenCalledWith(1);
  });
});


