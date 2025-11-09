import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LigaOverviewComponent} from './liga-overview.component';
import {LeagueHierarchyService} from '@shared/services';
import {Subject} from 'rxjs';
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
  let hierarchyService: jasmine.SpyObj<LeagueHierarchyService>;
  let hierarchySubject: Subject<LeagueHierarchyResult>;

  beforeEach(async(() => {
    // Mock Router erstellen
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);
    hierarchySubject = new Subject<LeagueHierarchyResult>();
    hierarchyService = jasmine.createSpyObj('LeagueHierarchyService', ['getHierarchy']);
    hierarchyService.getHierarchy.and.returnValue(hierarchySubject.asObservable());

    TestBed.configureTestingModule({
      declarations: [LigaOverviewComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: Router, useValue: mockRouter},
        {provide: LeagueHierarchyService, useValue: hierarchyService}
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
   * Test: Analytics Event wird korrekt getrackt (wenn _paq verfügbar ist)
   */
  it('should track analytics event on initialization when _paq is available', () => {
    // Mock _paq
    (window as any)._paq = [];
    spyOn((window as any)._paq, 'push');

    fixture.detectChanges();
    hierarchySubject.next({status: 'ok', data: [], reason: undefined});

    expect((window as any)._paq.push).toHaveBeenCalledWith(['trackEvent', 'Navigation', 'page_ligauebersicht_view']);

    // Cleanup
    delete (window as any)._paq;
  });

  /**
   * Test: Kein Fehler wenn _paq nicht verfügbar ist
   */
  it('should not throw error when _paq is not available', () => {
    // Sicherstellen dass _paq nicht existiert
    delete (window as any)._paq;

    expect(() => fixture.detectChanges()).not.toThrow();
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
    expect(component.isLoading).toBeFalse();
    expect(component.statusMessageKey).toBeNull();
  });

  it('should map empty state to status message', () => {
    fixture.detectChanges();

    hierarchySubject.next({status: 'empty', data: []});
    fixture.detectChanges();

    expect(component.treeNodes.length).toBe(0);
    expect(component.statusMessageKey).toBe('LIGAUEBERSICHT.STATUS.EMPTY');
  });
});
