import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {TranslateModule} from '@ngx-translate/core';
import {LigaOverviewComponent} from './liga-overview.component';

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

  beforeEach(async(() => {
    // Mock Router erstellen
    mockRouter = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      declarations: [LigaOverviewComponent],
      imports: [
        TranslateModule.forRoot()
      ],
      providers: [
        {provide: Router, useValue: mockRouter}
      ]
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
    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });

  /**
   * Test: Analytics Event wird korrekt getrackt (wenn _paq verfügbar ist)
   */
  it('should track analytics event on initialization when _paq is available', () => {
    // Mock _paq
    (window as any)._paq = [];
    spyOn((window as any)._paq, 'push');

    fixture.detectChanges();

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

    expect(() => {
      fixture.detectChanges();
    }).not.toThrow();
  });
});
