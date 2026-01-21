import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LigaOverviewComponent } from './liga-overview.component';
import { AnalyticsService, LeagueHierarchyService } from '@shared/services';
import { BehaviorSubject, Subject } from 'rxjs';
import { LeagueHierarchyResult } from '@shared/models/tree-node';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * Unit Tests für die Ligaübersicht-Komponente
 *
 * Testet:
 * - Komponente kann erstellt werden
 * - Analytics Event wird bei Initialisierung gefeuert
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
   * Test: Komponente kann erstellt werden
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test: ngOnInit wird ohne Fehler ausgeführt
   */
  it('should call ngOnInit without errors', () => {
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  /**
   * Test: Analytics Timing wird bei erfolgreichem Load getrackt
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
   * Test: Keine Timing-Messung bei leeren Daten
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

      // TreeComponent sollte expandPathTo aufrufen
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
   * Tests für Retry-Funktionalität
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
      // Error state allows retry
      expect(component.hierarchyResult?.status).toBe('error');
    });
  });

  /**
   * Tests für Timeout-State
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
      expect(errorState).toBeTruthy();
      // Timeout state allows retry
      expect(component.hierarchyResult?.status).toBe('timeout');
    });
  });

  /**
   * Tests für Offline-Fallback-State
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
   * Tests für Error-Handler im Subscribe
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
