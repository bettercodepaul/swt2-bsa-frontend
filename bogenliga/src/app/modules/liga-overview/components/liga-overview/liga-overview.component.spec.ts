import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LigaOverviewComponent } from './liga-overview.component';
import { AnalyticsService, LeagueHierarchyService } from '@shared/services';
import { BehaviorSubject, Subject } from 'rxjs';
import { LeagueHierarchyResult } from '@shared/models/tree-node';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * Unit tests for the league overview component.
 *
 * Verifies:
 * - component can be created
 * - analytics timing is triggered on initialization
 */
describe('LigaOverviewComponent', () => {
  let component: LigaOverviewComponent;
  let fixture: ComponentFixture<LigaOverviewComponent>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockActivatedRoute: any;
  let queryParamsSubject: BehaviorSubject<any>;
  let hierarchyService: jasmine.SpyObj<LeagueHierarchyService>;
  let hierarchySubject: Subject<LeagueHierarchyResult>;
  let analytics: jasmine.SpyObj<AnalyticsService>;

  beforeEach(async(() => {
    // Mock Router erstellen
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    queryParamsSubject = new BehaviorSubject<any>(convertToParamMap({}));
    mockActivatedRoute = {
      queryParamMap: queryParamsSubject.asObservable()
    };
    hierarchySubject = new Subject<LeagueHierarchyResult>();
    hierarchyService = jasmine.createSpyObj('LeagueHierarchyService', [
      'getHierarchyCached',
      'invalidateCache',
      'clearTreeState',
      'hasPersistedTreeState',
      'getExpandedIds',
      'getSelectedId',
      'saveExpandedIds',
      'saveSelectedId'
    ]);
    hierarchyService.getHierarchyCached.and.returnValue(hierarchySubject.asObservable());
    hierarchyService.hasPersistedTreeState.and.returnValue(Promise.resolve(false));
    hierarchyService.getExpandedIds.and.returnValue(Promise.resolve(new Set<number>()));
    hierarchyService.getSelectedId.and.returnValue(Promise.resolve(null));
    hierarchyService.saveExpandedIds.and.returnValue(Promise.resolve());
    hierarchyService.saveSelectedId.and.returnValue(Promise.resolve());
    hierarchyService.invalidateCache.and.returnValue(Promise.resolve());
    (hierarchyService as any).selectedId = null;
    (hierarchyService as any).expandedIds = new Set();
    analytics = jasmine.createSpyObj('AnalyticsService', ['startTimer', 'trackTiming', 'track']);
    analytics.startTimer.and.returnValue(() => 123);

    TestBed.configureTestingModule({
      declarations: [LigaOverviewComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        { provide: Router, useValue: mockRouter },
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LeagueHierarchyService, useValue: hierarchyService },
        { provide: AnalyticsService, useValue: analytics }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigaOverviewComponent);
    component = fixture.componentInstance;
  });

  /**
   * Test: component can be created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test: ngOnInit executes without errors.
   */
  it('should call ngOnInit without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  /**
   * Test: analytics timing is tracked on successful hierarchy load.
   */
  it('should track analytics timing on initialization when hierarchy loads', (done) => {
    fixture.detectChanges();
    hierarchySubject.next({ status: 'ok', data: [], reason: undefined });

    setTimeout(() => {
      expect(analytics.trackTiming).toHaveBeenCalledWith(
        'api_liga_hierarchie_timing',
        123,
        { status: 'ok' }
      );
      done();
    }, 0);
  });

  /**
   * Test: no timing measurement is tracked for empty hierarchy.
   */
  it('should not track timing when hierarchy is empty', () => {
    fixture.detectChanges();
    hierarchySubject.next({ status: 'empty', data: [] });
    fixture.detectChanges();

    expect(analytics.trackTiming).not.toHaveBeenCalled();
  });

  it('should hydrate tree nodes after hierarchy load', () => {
    const nodes = [
      { id: 1, name: 'Bundesliga', level: 0, parentId: null, children: [] }
    ];
    fixture.detectChanges();

    hierarchySubject.next({ status: 'ok', data: nodes });
    hierarchySubject.complete();
    fixture.detectChanges();

    expect(component.treeNodes).toEqual(nodes);
    expect(component.isLoading).toBe(false);
    expect(component.statusMessageKey).toBeNull();
  });

  it('should map empty state to status message', () => {
    fixture.detectChanges();

    hierarchySubject.next({ status: 'empty', data: [] });
    fixture.detectChanges();

    expect(component.treeNodes.length).toBe(0);
    expect(component.statusMessageKey).toBe('LIGAUEBERSICHT.STATUS.EMPTY');
  });

  it('should render tree skeleton while loading', () => {
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('bla-tree-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should render error state on error status', () => {
    fixture.detectChanges();

    hierarchySubject.next({ status: 'error', data: [] });
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('bla-error-state');
    expect(errorState).toBeTruthy();
  });

  it('should render empty state on empty status', () => {
    fixture.detectChanges();

    hierarchySubject.next({ status: 'empty', data: [] });
    fixture.detectChanges();

    const emptyState = fixture.nativeElement.querySelector('bla-empty-state');
    expect(emptyState).toBeTruthy();
  });

  describe('Expand / Collapse all header action', () => {
    it('should call expandToLevel on tree when not all expanded', () => {
      const treeMock: any = {
        expandToLevel: jasmine.createSpy('expandToLevel'),
        collapseAll: jasmine.createSpy('collapseAll'),
        isExpandedUpToLevel: jasmine.createSpy('isExpandedUpToLevel').and.returnValue(false)
      };
      (component as any).treeComponent = treeMock;

      fixture.detectChanges();

      component.onToggleExpandCollapseAll();

      expect(treeMock.expandToLevel)
        .toHaveBeenCalledWith((LigaOverviewComponent as any)['MAX_TREE_EXPAND_LEVEL']);
      expect(treeMock.collapseAll).not.toHaveBeenCalled();
    });

    it('should call collapseAll on tree when all expanded', () => {
      const treeMock: any = {
        expandToLevel: jasmine.createSpy('expandToLevel'),
        collapseAll: jasmine.createSpy('collapseAll'),
        isExpandedUpToLevel: jasmine.createSpy('isExpandedUpToLevel').and.returnValue(true)
      };
      (component as any).treeComponent = treeMock;

      component['updateTreeAllExpandedState']();
      fixture.detectChanges();

      component.onToggleExpandCollapseAll();

      expect(treeMock.collapseAll).toHaveBeenCalled();
      expect(treeMock.expandToLevel).not.toHaveBeenCalled();
    });

    it('should reflect aria-pressed state on header button', () => {
      fixture.detectChanges();

      hierarchySubject.next({ status: 'ok', data: [] as any });
      fixture.detectChanges();

      const btn: HTMLButtonElement =
        fixture.nativeElement.querySelector('[data-cy="liga-tree-toggle-all-button"]');

      expect(btn.getAttribute('aria-pressed')).toBe('false');

      component['treeAllExpanded'] = true;
      fixture.detectChanges();

      expect(btn.getAttribute('aria-pressed')).toBe('true');
    });
  });

  describe('Deeplink functionality', () => {
    it('should handle valid ligaId query parameter', (done) => {
      const nodes = [
        {
          id: 1,
          name: 'Bundesliga',
          level: 0,
          parentId: null,
          children: [
            { id: 2, name: 'Region A', level: 1, parentId: 1, children: [] }
          ]
        }
      ];

      fixture.detectChanges();
      hierarchySubject.next({ status: 'ok', data: nodes });
      fixture.detectChanges();

      // Simulate query param
      queryParamsSubject.next(convertToParamMap({ ligaId: '2' }));

      // TreeComponent should expand and select this node
      setTimeout(() => {
        expect(component.selectedLigaId).toBe(2);
        done();
      }, 200);
    });

    it('should show error message for invalid ligaId', (done) => {
      fixture.detectChanges();

      queryParamsSubject.next(convertToParamMap({ ligaId: 'invalid' }));

      setTimeout(() => {
        expect(component.deeplinkMessageKey).toBe('LIGAUEBERSICHT.DEEPLINK.INVALID_ID');
        done();
      }, 50);
    });

    it('should show error message for non-existent ligaId', (done) => {
      const nodes = [
        { id: 1, name: 'Bundesliga', level: 0, parentId: null, children: [] }
      ];

      fixture.detectChanges();
      hierarchySubject.next({ status: 'ok', data: nodes });
      fixture.detectChanges();

      queryParamsSubject.next(convertToParamMap({ ligaId: '999' }));

      setTimeout(() => {
        expect(component.deeplinkMessageKey).toBe('LIGAUEBERSICHT.DEEPLINK.INVALID_ID');
        done();
      }, 200);
    });

    it('should navigate to league homepage on tree selection', () => {
      component.onTreeSelect(123);

      expect(mockRouter.navigate).toHaveBeenCalledWith(
        ['/home'],
        {
          queryParams: { liga: 123 },
          queryParamsHandling: 'merge'
        }
      );
    });
  });

/**
   * Tests for retry functionality.
   */
  describe('Retry functionality', () => {
    it('should invalidate cache and reload on retry', async () => {
      hierarchyService.invalidateCache.and.returnValue(Promise.resolve());
      fixture.detectChanges();

      // Simulate error state
      hierarchySubject.next({ status: 'error', data: [], reason: 'Server error' });
      fixture.detectChanges();

      // Trigger retry
      component.onRetry();

      // Wait for async invalidateCache
      await fixture.whenStable();

      expect(hierarchyService.invalidateCache).toHaveBeenCalled();
      expect(hierarchyService.getHierarchyCached).toHaveBeenCalledTimes(2);
    });

    it('should show loading state during retry', async () => {
      hierarchyService.invalidateCache.and.returnValue(Promise.resolve());
      fixture.detectChanges();

      // Initial load
      hierarchySubject.next({ status: 'error', data: [] });
      fixture.detectChanges();

      // Trigger retry
      component.onRetry();
      await fixture.whenStable();
      fixture.detectChanges();

      expect(component.isLoading).toBe(true);
    });

    it('should render retry button in error state', () => {
      fixture.detectChanges();

      hierarchySubject.next({ status: 'error', data: [] });
      fixture.detectChanges();

      const retryButton = fixture.nativeElement.querySelector('bla-error-state');
      expect(retryButton).toBeTruthy();
      expect(retryButton.getAttribute('ng-reflect-show-retry')).toBe('true');
    });
  });

/**
   * Tests for timeout state.
   */
  describe('Timeout state', () => {
    it('should render error state on timeout status', () => {
      fixture.detectChanges();

      hierarchySubject.next({ status: 'timeout', data: [], reason: 'Request timed out' });
      fixture.detectChanges();

      const errorState = fixture.nativeElement.querySelector('bla-error-state');
      expect(errorState).toBeTruthy();
    });

    it('should set timeout status message key', () => {
      fixture.detectChanges();

      hierarchySubject.next({ status: 'timeout', data: [], reason: 'Request timed out' });
      fixture.detectChanges();

      expect(component.statusMessageKey).toBe('LIGAUEBERSICHT.STATUS.TIMEOUT');
    });

    it('should allow retry on timeout', () => {
      hierarchyService.invalidateCache.and.returnValue(Promise.resolve());
      fixture.detectChanges();

      hierarchySubject.next({ status: 'timeout', data: [] });
      fixture.detectChanges();

      const errorState = fixture.nativeElement.querySelector('bla-error-state');
      expect(errorState.getAttribute('ng-reflect-show-retry')).toBe('true');
    });
  });

/**
   * Tests for offline-fallback state.
   */
  describe('Offline-fallback state', () => {
    it('should render tree with offline-fallback data', () => {
      const nodes = [
        { id: 1, name: 'Offline Liga', level: 0, parentId: null, children: [] }
      ];
      fixture.detectChanges();

      hierarchySubject.next({ status: 'offline-fallback', data: nodes });
      fixture.detectChanges();

      expect(component.treeNodes).toEqual(nodes);
      expect(component.statusMessageKey).toBe('LIGAUEBERSICHT.STATUS.OFFLINE_FALLBACK');
    });

    it('should show info alert for offline-fallback', () => {
      const nodes = [
        { id: 1, name: 'Offline Liga', level: 0, parentId: null, children: [] }
      ];
      fixture.detectChanges();

      hierarchySubject.next({ status: 'offline-fallback', data: nodes });
      fixture.detectChanges();

      const infoAlert = fixture.nativeElement.querySelector('.alert-info');
      expect(infoAlert).toBeTruthy();
    });

    it('should still render tree component in offline-fallback mode', () => {
      const nodes = [
        { id: 1, name: 'Fallback Liga', level: 0, parentId: null, children: [] }
      ];
      fixture.detectChanges();

      hierarchySubject.next({ status: 'offline-fallback', data: nodes });
      fixture.detectChanges();

      const tree = fixture.nativeElement.querySelector('bla-league-tree');
      expect(tree).toBeTruthy();
    });
  });

/**
   * Tests for error handling in the subscription callback.
   */
  describe('Error handling in subscribe', () => {
    it('should handle unhandled errors in subscribe error callback', () => {
      fixture.detectChanges();

      // Simulate unhandled error via subject.error()
      hierarchySubject.error(new Error('Unhandled error'));
      fixture.detectChanges();

      expect(component.hierarchyResult?.status).toBe('error');
      expect(component.statusMessageKey).toBe('LIGAUEBERSICHT.STATUS.ERROR');
      expect(component.isLoading).toBe(false);
    });

    it('should clear tree nodes on unhandled error', () => {
      const nodes = [{ id: 1, name: 'Test', level: 0, parentId: null, children: [] }];
      component.treeNodes = nodes;
      fixture.detectChanges();

      hierarchySubject.error(new Error('Unhandled error'));
      fixture.detectChanges();

      expect(component.treeNodes).toEqual([]);
    });
  });
});
