import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Maske4ZustandComponent} from './maske4zustand.component';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {By} from '@angular/platform-browser';
import {AppComponent} from 'src/app/app.component';

describe('Maske4ZustandComponent', () => {
  let component: Maske4ZustandComponent;
  let fixture: ComponentFixture<Maske4ZustandComponent>;
  let app: {fullscreen: boolean};

  beforeEach(async () => {
    app = {fullscreen: false};
    await TestBed.configureTestingModule({
      declarations: [Maske4ZustandComponent],
      providers: [
        {provide: AppComponent, useValue: app}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(Maske4ZustandComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('sets fullscreen while active', () => {
    component.ngOnInit();
    expect(app.fullscreen).toBe(true);

    component.ngOnDestroy();
    expect(app.fullscreen).toBe(false);
  });

  it('renders match summary when schusszettel links are missing', () => {
    const mock: TabletSchusszettel = {
      status: 'SATZEINGABE' as any,
      eigenesTeam:    { teamId: 1, teamName: 'Alpha' },
      gegnerischesTeam: { teamId: 2, teamName: 'Beta' },
      schuetzenMatchPunkte: [],
      schuetzeStammDaten: [],
      satzErgebnisse: [
        { satzNr: 1, team1Punkte: 5, team2Punkte: 4 },
        { satzNr: 2, team1Punkte: 3, team2Punkte: 3 }
      ],
      matchErgebnis: [
        { teamId: 1, teamName: 'Alpha', matchpunkte: 2 },
        { teamId: 2, teamName: 'Beta', matchpunkte: 0 }
      ],
      verfuegbareSchuetzen: []
    };

    component.infos = mock;
    fixture.detectChanges();

    const summary = fixture.debugElement.query(By.css('.match-summary'));
    expect(summary).toBeTruthy();
    expect(summary.nativeElement.textContent).toContain('Alpha');
    expect(summary.nativeElement.textContent).toContain('Beta');
  });

  it('does not render when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.maske4-zustand'));
    expect(container).toBeNull();
  });
});
