import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {FormsModule} from '@angular/forms';
import {ActivatedRoute, convertToParamMap} from '@angular/router';
import {BehaviorSubject, of, throwError} from 'rxjs';

import {KampfrichterAnsichtComponent} from './kampfrichter-ansicht.component';
import {KampfrichterAnsichtService, KampfrichterMatchDO} from '@schusszettel/services/kampfrichter-ansicht.service';

// ── helpers ──────────────────────────────────────────────────────────────────

function makeMatch(overrides: Partial<KampfrichterMatchDO> = {}): KampfrichterMatchDO {
  return {
    matchId: 1,
    nr: 1,
    begegnung: 1,
    matchScheibennummer: 1,
    mannschaftId: 10,
    mannschaftName: 'Team A',
    strafPunkteSatz1: 0,
    strafPunkteSatz2: 0,
    strafPunkteSatz3: 0,
    strafPunkteSatz4: 0,
    strafPunkteSatz5: 0,
    sessionStatus: 'SATZEINGABE',
    ...overrides
  };
}

function makeRoute(params: {token?: string; wettkampfid?: string} = {}) {
  return {
    queryParamMap: of(convertToParamMap({
      token:       params.token       ?? 'valid-token',
      wettkampfid: params.wettkampfid ?? '42'
    }))
  };
}

// ── suite ─────────────────────────────────────────────────────────────────────

describe('KampfrichterAnsichtComponent', () => {
  let component: KampfrichterAnsichtComponent;
  let fixture: ComponentFixture<KampfrichterAnsichtComponent>;
  let serviceSpy: jasmine.SpyObj<KampfrichterAnsichtService>;
  let routeSubject: BehaviorSubject<any>;

  const defaultMatches = [
    makeMatch({matchId: 1, matchScheibennummer: 2, mannschaftName: 'Team B', sessionStatus: 'SATZEINGABE'}),
    makeMatch({matchId: 2, matchScheibennummer: 1, mannschaftName: 'Team A', sessionStatus: 'SCHUETZENMELDUNG'}),
  ];

  beforeEach(async () => {
    routeSubject = new BehaviorSubject(convertToParamMap({token: 'valid-token', wettkampfid: '42'}));

    serviceSpy = jasmine.createSpyObj('KampfrichterAnsichtService', [
      'getMatches',
      'updateStrafpunkte'
    ]);
    serviceSpy.getMatches.and.callFake(() => of(defaultMatches.map(m => ({...m}))));
    serviceSpy.updateStrafpunkte.and.returnValue(of({message: 'Strafpunkte gespeichert'}));

    await TestBed.configureTestingModule({
      imports:      [FormsModule],
      declarations: [KampfrichterAnsichtComponent],
      providers: [
        {provide: KampfrichterAnsichtService, useValue: serviceSpy},
        {provide: ActivatedRoute,             useValue: {queryParamMap: routeSubject}}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(KampfrichterAnsichtComponent);
    component = fixture.componentInstance;
  });

  // ── creation ───────────────────────────────────────────────────────────────

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ── initial load ───────────────────────────────────────────────────────────

  it('reads token and wettkampfId from query params', () => {
    fixture.detectChanges();
    expect(component.token).toBe('valid-token');
    expect(component.wettkampfId).toBe(42);
  });

  it('calls getMatches on init', () => {
    fixture.detectChanges();
    expect(serviceSpy.getMatches).toHaveBeenCalled();
  });

  it('sets lastUpdated after successful load', () => {
    fixture.detectChanges();
    expect(component.lastUpdated instanceof Date).toBe(true);
  });

  it('stops loading after successful response', () => {
    fixture.detectChanges();
    expect(component.loading).toBe(false);
  });

  // ── error handling ─────────────────────────────────────────────────────────

  it('shows "Ungültiger Zugangstoken." on 403', () => {
    serviceSpy.getMatches.and.returnValue(throwError({status: 403}));
    fixture.detectChanges();
    expect(component.errorMsg).toBe('Ungültiger Zugangstoken.');
    expect(component.loading).toBe(false);
  });

  it('shows generic error message on non-403 failure', () => {
    serviceSpy.getMatches.and.returnValue(throwError({status: 500}));
    fixture.detectChanges();
    expect(component.errorMsg).toBe('Fehler beim Laden der Matches.');
  });

  it('shows error when token is missing from URL', () => {
    routeSubject.next(convertToParamMap({token: '', wettkampfid: '42'}));
    fixture.detectChanges();
    expect(component.errorMsg).toBe('Ungültige URL-Parameter.');
  });

  it('shows error when wettkampfid is missing from URL', () => {
    routeSubject.next(convertToParamMap({token: 'valid-token', wettkampfid: ''}));
    fixture.detectChanges();
    expect(component.errorMsg).toBe('Ungültige URL-Parameter.');
  });

  // ── sorting ────────────────────────────────────────────────────────────────

  it('matchesByScheibe sorts ascending by scheibennummer', () => {
    fixture.detectChanges();
    const sorted = component.matchesByScheibe();
    expect(sorted[0].matchScheibennummer).toBe(1);
    expect(sorted[1].matchScheibennummer).toBe(2);
  });

  // ── meldung status ─────────────────────────────────────────────────────────

  it('isMeldungFehlt returns true for SCHUETZENMELDUNG', () => {
    const m = makeMatch({sessionStatus: 'SCHUETZENMELDUNG'});
    expect(component.isMeldungFehlt(m)).toBe(true);
  });

  it('isMeldungFehlt returns true for UNBEKANNT', () => {
    const m = makeMatch({sessionStatus: 'UNBEKANNT'});
    expect(component.isMeldungFehlt(m)).toBe(true);
  });

  it('isMeldungFehlt returns false for SATZEINGABE', () => {
    const m = makeMatch({sessionStatus: 'SATZEINGABE'});
    expect(component.isMeldungFehlt(m)).toBe(false);
  });

  it('isMeldungFehlt returns false for WARTE', () => {
    const m = makeMatch({sessionStatus: 'WARTE'});
    expect(component.isMeldungFehlt(m)).toBe(false);
  });

  // ── expand / collapse ──────────────────────────────────────────────────────

  it('all matches are expanded by default after load', () => {
    fixture.detectChanges();
    component.matches.forEach(m => {
      expect(component.isExpanded(m.matchId)).toBe(true);
    });
  });

  it('toggleExpanded collapses an expanded match', () => {
    fixture.detectChanges();
    const id = component.matches[0].matchId;
    expect(component.isExpanded(id)).toBe(true);
    component.toggleExpanded(id);
    expect(component.isExpanded(id)).toBe(false);
  });

  it('toggleExpanded expands a collapsed match', () => {
    fixture.detectChanges();
    const id = component.matches[0].matchId;
    component.toggleExpanded(id); // collapse
    component.toggleExpanded(id); // expand again
    expect(component.isExpanded(id)).toBe(true);
  });

  it('isExpanded returns true by default for unknown id', () => {
    expect(component.isExpanded(9999)).toBe(true);
  });

  // ── strafpunkte helper ─────────────────────────────────────────────────────

  it('getSatz returns correct value for each satz', () => {
    const m = makeMatch({
      strafPunkteSatz1: 1, strafPunkteSatz2: 2,
      strafPunkteSatz3: 3, strafPunkteSatz4: 4, strafPunkteSatz5: 5
    });
    expect(component.getSatz(m, 1)).toBe(1);
    expect(component.getSatz(m, 2)).toBe(2);
    expect(component.getSatz(m, 3)).toBe(3);
    expect(component.getSatz(m, 4)).toBe(4);
    expect(component.getSatz(m, 5)).toBe(5);
  });

  it('getSatz returns 0 for null value', () => {
    const m = makeMatch({strafPunkteSatz1: null as any});
    expect(component.getSatz(m, 1)).toBe(0);
  });

  it('getSatz returns 0 for unknown satz index', () => {
    const m = makeMatch();
    expect(component.getSatz(m, 99)).toBe(0);
  });

  it('setSatz updates the correct field', () => {
    const m = makeMatch();
    component.setSatz(m, 1, 7);  expect(m.strafPunkteSatz1).toBe(7);
    component.setSatz(m, 2, 8);  expect(m.strafPunkteSatz2).toBe(8);
    component.setSatz(m, 3, 9);  expect(m.strafPunkteSatz3).toBe(9);
    component.setSatz(m, 4, 3);  expect(m.strafPunkteSatz4).toBe(3);
    component.setSatz(m, 5, 2);  expect(m.strafPunkteSatz5).toBe(2);
  });

  // ── save on blur ───────────────────────────────────────────────────────────

  it('saveStrafpunkteOnBlur calls updateStrafpunkte with correct payload', () => {
    fixture.detectChanges();
    const m = makeMatch({
      matchId: 7,
      strafPunkteSatz1: 1, strafPunkteSatz2: 2,
      strafPunkteSatz3: 3, strafPunkteSatz4: 4, strafPunkteSatz5: 5
    });
    component.token = 'valid-token';
    component.wettkampfId = 42;

    component.saveStrafpunkteOnBlur(m);

    const args = serviceSpy.updateStrafpunkte.calls.mostRecent().args;
    expect(args[0]).toBe(42);
    expect(args[1]).toBe('valid-token');
    expect(args[2].matchId).toBe(7);
    expect(args[2].strafPunkteSatz1).toBe(1);
    expect(args[2].strafPunkteSatz5).toBe(5);
  });

  it('saveStrafpunkteOnBlur adds matchId to savedMatchIds on success', () => {
    fixture.detectChanges();
    const m = makeMatch({matchId: 7});
    component.saveStrafpunkteOnBlur(m);
    expect(component.savedMatchIds.has(7)).toBe(true);
  });

  it('saveStrafpunkteOnBlur uses 0 for null strafpunkte', () => {
    fixture.detectChanges();
    const m = makeMatch({strafPunkteSatz1: null as any, strafPunkteSatz3: null as any});
    component.saveStrafpunkteOnBlur(m);
    const payload = serviceSpy.updateStrafpunkte.calls.mostRecent().args[2];
    expect(payload.strafPunkteSatz1).toBe(0);
    expect(payload.strafPunkteSatz3).toBe(0);
  });

  // ── auto-refresh (mergeMatches) ────────────────────────────────────────────

  it('mergeMatches updates sessionStatus on refresh', () => {
    fixture.detectChanges();
    const updated = component.matches.map(m => ({
      ...m,
      sessionStatus: 'WARTE'
    }));
    (component as any).mergeMatches(updated);
    component.matches.forEach(m => {
      expect(m.sessionStatus).toBe('WARTE');
    });
  });

  it('mergeMatches does not overwrite strafpunkte for savedMatchIds', () => {
    fixture.detectChanges();
    const matchId = component.matches[0].matchId;
    component.matches[0].strafPunkteSatz1 = 99;
    component.savedMatchIds.add(matchId);

    const incoming = component.matches.map(m => ({...m, strafPunkteSatz1: 0}));
    (component as any).mergeMatches(incoming);

    expect(component.matches[0].strafPunkteSatz1).toBe(99);
  });

  it('mergeMatches adds new matches that were not present before', () => {
    fixture.detectChanges();
    const initialCount = component.matches.length;
    const newMatch = makeMatch({matchId: 999, matchScheibennummer: 10});
    (component as any).mergeMatches([...component.matches, newMatch]);
    expect(component.matches.length).toBe(initialCount + 1);
  });

  // ── DOM rendering ──────────────────────────────────────────────────────────

  it('renders a card for each match', () => {
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.match-card'));
    expect(cards.length).toBe(defaultMatches.length);
  });

  it('applies meldung-fehlt class to card when sessionStatus is SCHUETZENMELDUNG', () => {
    fixture.detectChanges();
    const cards = fixture.debugElement.queryAll(By.css('.match-card'));
    const sorted = component.matchesByScheibe();
    const fehltIndex = sorted.findIndex(m => m.sessionStatus === 'SCHUETZENMELDUNG');
    expect(cards[fehltIndex].nativeElement.classList.contains('meldung-fehlt')).toBe(true);
  });

  it('shows error message in DOM when errorMsg is set', () => {
    serviceSpy.getMatches.and.returnValue(throwError({status: 500}));
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.error-msg'));
    expect(el).toBeTruthy();
    expect(el.nativeElement.textContent).toContain('Fehler beim Laden');
  });

  it('shows loading hint while loading', () => {
    fixture.detectChanges();       // init normally
    component.loading = true;      // set after init so ngOnInit doesn't reset it
    fixture.detectChanges();       // re-render with loading=true
    const el = fixture.debugElement.query(By.css('.loading-hint'));
    expect(el).toBeTruthy();
  });

  it('shows empty hint when no matches returned', () => {
    serviceSpy.getMatches.and.returnValue(of([]));
    fixture.detectChanges();
    const el = fixture.debugElement.query(By.css('.empty-hint'));
    expect(el).toBeTruthy();
  });

  // ── cleanup ────────────────────────────────────────────────────────────────

  it('completes destroy$ on ngOnDestroy to stop subscriptions', () => {
    fixture.detectChanges();
    let completed = false;
    (component as any).destroy$.subscribe({complete: () => (completed = true)});
    component.ngOnDestroy();
    expect(completed).toBe(true);
  });
});
