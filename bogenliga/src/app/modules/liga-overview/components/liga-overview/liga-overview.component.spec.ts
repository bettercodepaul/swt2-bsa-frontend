import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {ActivatedRoute, convertToParamMap, Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LigaOverviewComponent} from './liga-overview.component';
import {AnalyticsService, LeagueHierarchyService} from '@shared/services';
import {BehaviorSubject, Subject} from 'rxjs';
import {LeagueHierarchyResult} from '@shared/models/tree-node';
import {NO_ERRORS_SCHEMA} from '@angular/core';

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
      'hasPersistedTreeState'
    ]);
    hierarchyService.getHierarchyCached.and.returnValue(hierarchySubject.asObservable());
    hierarchyService.hasPersistedTreeState.and.returnValue(false);
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
        {provide: Router, useValue: mockRouter},
        {provide: ActivatedRoute, useValue: mockActivatedRoute},
        {provide: LeagueHierarchyService, useValue: hierarchyService},
        {provide: AnalyticsService, useValue: analytics}
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
    hierarchySubject.next({status: 'ok', data: [], reason: undefined});

    setTimeout(() => {
      expect(analytics.trackTiming).toHaveBeenCalledWith(
        'api_liga_hierarchie_timing',
        123,
        {status: 'ok'}
      );
      done();
    }, 0);
  });

  /**
   * Test: Keine Timing-Messung bei leeren Daten
   */
  it('should not track timing when hierarchy is empty', () => {
    fixture.detectChanges();
    hierarchySubject.next({status: 'empty', data: []});
    fixture.detectChanges();

    expect(analytics.trackTiming).not.toHaveBeenCalled();
  });

  it('should hydrate tree nodes after hierarchy load', () => {
    const nodes = [
      {id: 1, name: 'Bundesliga', level: 0, parentId: null, children: []}
    ];
    fixture.detectChanges();

    hierarchySubject.next({status: 'ok', data: nodes});
    hierarchySubject.complete();
    fixture.detectChanges();

    expect(component.treeNodes).toEqual(nodes);
    expect(component.isLoading).toBe(false);
    expect(component.statusMessageKey).toBeNull();
  });

  it('should map empty state to status message', () => {
    fixture.detectChanges();

    hierarchySubject.next({status: 'empty', data: []});
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

    hierarchySubject.next({status: 'error', data: []});
    fixture.detectChanges();

    const errorState = fixture.nativeElement.querySelector('bla-error-state');
    expect(errorState).toBeTruthy();
  });

  it('should render empty state on empty status', () => {
    fixture.detectChanges();

    hierarchySubject.next({status: 'empty', data: []});
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
            {id: 2, name: 'Region A', level: 1, parentId: 1, children: []}
          ]
        }
      ];

      fixture.detectChanges();
      hierarchySubject.next({status: 'ok', data: nodes});
      fixture.detectChanges();

      // Simulate query param
      queryParamsSubject.next(convertToParamMap({ligaId: '2'}));

      // TreeComponent sollte expandPathTo aufrufen
      setTimeout(() => {
        expect(component.selectedLigaId).toBe(2);
        done();
      }, 200);
    });

    it('should show error message for invalid ligaId', (done) => {
      fixture.detectChanges();

      queryParamsSubject.next(convertToParamMap({ligaId: 'invalid'}));

      setTimeout(() => {
        expect(component.deeplinkMessageKey).toBe('LIGAUEBERSICHT.DEEPLINK.INVALID_ID');
        done();
      }, 50);
    });

    it('should show error message for non-existent ligaId', (done) => {
      const nodes = [
        {id: 1, name: 'Bundesliga', level: 0, parentId: null, children: []}
      ];

      fixture.detectChanges();
      hierarchySubject.next({status: 'ok', data: nodes});
      fixture.detectChanges();

      queryParamsSubject.next(convertToParamMap({ligaId: '999'}));

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
});
