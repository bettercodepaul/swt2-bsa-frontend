import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ChangeDetectorRef, NO_ERRORS_SCHEMA } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { TreeNodeComponent } from './tree-node.component';
import { LeagueTreeNode } from '@shared/models/tree-node';

describe('TreeNodeComponent', () => {
  let component: TreeNodeComponent;
  let fixture: ComponentFixture<TreeNodeComponent>;
  let cdr: ChangeDetectorRef;

  const nodeWithChildren: LeagueTreeNode = {
    id: 1,
    name: 'Bundesliga',
    level: 0,
    parentId: null,
    children: [
      { id: 2, name: 'Regionalliga', level: 1, parentId: 1, children: [] }
    ]
  };

  const nodeWithoutChildren: LeagueTreeNode = {
    id: 3,
    name: 'Landesliga',
    level: 0,
    parentId: null,
    children: []
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TreeNodeComponent],
      imports: [TranslateModule.forRoot()],
      schemas: [NO_ERRORS_SCHEMA],
      providers: [
        { provide: ChangeDetectorRef, useValue: { markForCheck: jasmine.createSpy('markForCheck') } }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TreeNodeComponent);
    component = fixture.componentInstance;
    cdr = TestBed.inject(ChangeDetectorRef);
    component.node = nodeWithChildren;
    component.expandedIds = new Set();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Rendering', () => {
    it('should render node with children', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.bla-league-tree__label')).toBeTruthy();
      expect(element.querySelector('.bla-league-tree__toggle')).toBeTruthy();
      expect(element.querySelector('.bla-league-tree__toggle-placeholder')).toBeFalsy();
    });

    it('should render node without children (no toggle button, only placeholder)', () => {
      component.node = nodeWithoutChildren;
      fixture.detectChanges();

      const element = fixture.nativeElement;
      expect(element.querySelector('.bla-league-tree__toggle')).toBeFalsy();
      expect(element.querySelector('.bla-league-tree__toggle-placeholder')).toBeTruthy();
    });

    it('should display node name', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const label = fixture.nativeElement.querySelector('.bla-league-tree__label');
      expect(label.textContent.trim()).toBe('Bundesliga');
    });
  });

  describe('Expand/Collapse Toggle', () => {
    it('should show toggle button when node has children', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.bla-league-tree__toggle');
      expect(toggleButton).toBeTruthy();
    });

    it('should not show toggle button when node has no children', () => {
      component.node = nodeWithoutChildren;
      fixture.detectChanges();

      const toggleButton = fixture.nativeElement.querySelector('.bla-league-tree__toggle');
      expect(toggleButton).toBeFalsy();
    });

    it('should emit toggle event when toggle button is clicked', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.toggle, 'emit');
      const toggleButton = fixture.nativeElement.querySelector('.bla-league-tree__toggle');
      toggleButton.click();

      expect(component.toggle.emit).toHaveBeenCalledWith(1);
    });

    it('should emit focusRequest when toggle button is clicked', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.focusRequest, 'emit');
      const toggleButton = fixture.nativeElement.querySelector('.bla-league-tree__toggle');
      toggleButton.click();

      expect(component.focusRequest.emit).toHaveBeenCalledWith(1);
    });

    it('should apply expanded CSS class when expanded', () => {
      component.node = nodeWithChildren;
      component.expanded = true;
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.bla-league-tree__toggle-icon');
      expect(icon.classList.contains('bla-league-tree__toggle-icon--expanded')).toBe(true);
    });

    it('should not apply expanded CSS class when collapsed', () => {
      component.node = nodeWithChildren;
      component.expanded = false;
      fixture.detectChanges();

      const icon = fixture.nativeElement.querySelector('.bla-league-tree__toggle-icon');
      expect(icon.classList.contains('bla-league-tree__toggle-icon--expanded')).toBe(false);
    });
  });

  describe('Selection Handling', () => {
    it('should emit selectRequest when label is clicked', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.selectRequest, 'emit');
      const label = fixture.nativeElement.querySelector('.bla-league-tree__label');
      label.click();

      expect(component.selectRequest.emit).toHaveBeenCalledWith(1);
    });

    it('should emit selectRequest when item row is clicked', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.selectRequest, 'emit');
      const itemRow = fixture.nativeElement.querySelector('.bla-league-tree__item-row');
      itemRow.click();

      expect(component.selectRequest.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('ARIA Attributes', () => {
    it('should set role="treeitem" on host element', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('role')).toBe('treeitem');
    });

    it('should set aria-expanded to true when expanded', () => {
      component.node = nodeWithChildren;
      component.expanded = true;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-expanded')).toBe('true');
    });

    it('should set aria-expanded to false when collapsed', () => {
      component.node = nodeWithChildren;
      component.expanded = false;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-expanded')).toBe('false');
    });

    it('should set aria-expanded to null when node has no children', () => {
      component.node = nodeWithoutChildren;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-expanded')).toBeNull();
    });

    it('should set aria-selected to true when selected', () => {
      component.node = nodeWithChildren;
      component.selectedId = 1;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-selected')).toBe('true');
    });

    it('should set aria-selected to false when not selected', () => {
      component.node = nodeWithChildren;
      component.selectedId = 999;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-selected')).toBe('false');
    });

    it('should set aria-level based on node level', () => {
      component.node = { ...nodeWithChildren, level: 2 };
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-level')).toBe('3'); // level + 1
    });

    it('should set aria-label to node name', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-label')).toBe('Bundesliga');
    });

    it('should set aria-controls when expanded and has children', () => {
      component.node = nodeWithChildren;
      component.expanded = true;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-controls')).toBe('league-tree-group-1');
    });

    it('should not set aria-controls when collapsed', () => {
      component.node = nodeWithChildren;
      component.expanded = false;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('aria-controls')).toBeNull();
    });

    it('should render role="group" for children list when expanded', () => {
      component.node = nodeWithChildren;
      component.expanded = true;
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector('[role="group"]');
      expect(group).toBeTruthy();
      expect(group.id).toBe('league-tree-group-1');
    });

    it('should not render group when collapsed', () => {
      component.node = nodeWithChildren;
      component.expanded = false;
      fixture.detectChanges();

      const group = fixture.nativeElement.querySelector('[role="group"]');
      expect(group).toBeFalsy();
    });
  });

  describe('Event Emission', () => {
    it('should emit toggle event', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.toggle, 'emit');
      component.onToggleClick(new MouseEvent('click'));

      expect(component.toggle.emit).toHaveBeenCalledWith(1);
    });

    it('should emit focusRequest on toggle click', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.focusRequest, 'emit');
      component.onToggleClick(new MouseEvent('click'));

      expect(component.focusRequest.emit).toHaveBeenCalledWith(1);
    });

    it('should emit selectRequest on item click', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.selectRequest, 'emit');
      component.onItemClick();

      expect(component.selectRequest.emit).toHaveBeenCalledWith(1);
    });

    it('should emit focusRequest on focus', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      spyOn(component.focusRequest, 'emit');
      component.onFocus();

      expect(component.focusRequest.emit).toHaveBeenCalledWith(1);
    });
  });

  describe('Tabindex Management', () => {
    it('should set tabindex to 0 when focused', () => {
      component.node = nodeWithChildren;
      component.focusedId = 1;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('tabindex')).toBe('0');
    });

    it('should set tabindex to -1 when not focused', () => {
      component.node = nodeWithChildren;
      component.focusedId = 999;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.getAttribute('tabindex')).toBe('-1');
    });
  });

  describe('CSS Classes', () => {
    it('should apply selected class when selected', () => {
      component.node = nodeWithChildren;
      component.selectedId = 1;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('bla-league-tree__item--selected')).toBe(true);
    });

    it('should apply expanded class when expanded', () => {
      component.node = nodeWithChildren;
      component.expanded = true;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('bla-league-tree__item--expanded')).toBe(true);
    });

    it('should apply focused class when focused', () => {
      component.node = nodeWithChildren;
      component.focusedId = 1;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('bla-league-tree__item--focused')).toBe(true);
    });

    it('should apply has-children class when node has children', () => {
      component.node = nodeWithChildren;
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('bla-league-tree__item--has-children')).toBe(true);
    });

    it('should apply root class when level is 0', () => {
      component.node = { ...nodeWithChildren, level: 0 };
      fixture.detectChanges();

      const hostElement = fixture.nativeElement;
      expect(hostElement.classList.contains('bla-league-tree__item--root')).toBe(true);
    });
  });

  describe('Indentierung', () => {
    it('should calculate padding based on level', () => {
      component.node = { ...nodeWithChildren, level: 2 };
      fixture.detectChanges();

      expect(component.paddingLeft).toBe(40); // 2 * 20px
    });

    it('should clamp padding to maximum 96px', () => {
      component.node = { ...nodeWithChildren, level: 10 };
      fixture.detectChanges();

      expect(component.paddingLeft).toBe(96);
    });
  });

  describe('ngOnChanges', () => {
    it('should mark for check when focusedId changes', () => {
      component.node = nodeWithChildren;
      component.ngOnChanges({ focusedId: { previousValue: null, currentValue: 1, firstChange: false, isFirstChange: () => false } });

      expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should mark for check when selectedId changes', () => {
      component.node = nodeWithChildren;
      component.ngOnChanges({ selectedId: { previousValue: null, currentValue: 1, firstChange: false, isFirstChange: () => false } });

      expect(cdr.markForCheck).toHaveBeenCalled();
    });

    it('should mark for check when expanded changes', () => {
      component.node = nodeWithChildren;
      component.ngOnChanges({ expanded: { previousValue: false, currentValue: true, firstChange: false, isFirstChange: () => false } });

      expect(cdr.markForCheck).toHaveBeenCalled();
    });
  });
});
