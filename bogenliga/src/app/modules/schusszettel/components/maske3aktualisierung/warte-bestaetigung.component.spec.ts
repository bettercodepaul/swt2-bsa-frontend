import {NO_ERRORS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WarteBestaetigungComponent} from './warte-bestaetigung.component';
import {By} from '@angular/platform-browser';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {AppComponent} from 'src/app/app.component';

describe('WarteBestaetigungComponent', () => {
  let component: WarteBestaetigungComponent;
  let fixture: ComponentFixture<WarteBestaetigungComponent>;
  let app: {fullscreen: boolean};

  beforeEach(async () => {
    app = {fullscreen: false};
    await TestBed.configureTestingModule({
      imports: [MatProgressSpinnerModule, NoopAnimationsModule],
      declarations: [WarteBestaetigungComponent],
      providers: [
        {provide: AppComponent, useValue: app}
      ],
      schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarteBestaetigungComponent);
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

  it('renders spinner and message when infos is set', () => {
    const mock: TabletSchusszettel = {
      status: 'WARTE' as any,
      eigenesTeam:    { teamId: 1, teamName: 'Alpha' },
      gegnerischesTeam: { teamId: 2, teamName: 'Beta' },
      schuetzenMatchPunkte: [],
      schuetzeStammDaten: [],
      satzErgebnisse: [],
      matchErgebnis: [],
      verfuegbareSchuetzen: []
    };
    component.infos = mock;
    fixture.detectChanges();

    // Expect spinner present
    const spinner = fixture.debugElement.query(By.css('mat-spinner'));
    expect(spinner).toBeTruthy();

    // Expect the waiting message
    const msg = fixture.debugElement.query(By.css('.info-box p')).nativeElement.textContent;
    expect(msg).toContain('Das System hat deine Satzeingabe erhalten');
  });

  it('emits refresh when button clicked', () => {
    component.infos = {} as any;
    fixture.detectChanges();

    let emitted = false;
    component.refresh.subscribe(() => (emitted = true));

    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    btn.click();
    expect(emitted).toBe(true);
  });

  it('does not render anything when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.warte-container'));
    expect(container).toBeNull();
  });
});
