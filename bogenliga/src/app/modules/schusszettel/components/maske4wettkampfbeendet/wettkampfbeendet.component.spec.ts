import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WettkampfbeendetComponent} from './wettkampfbeendet.component';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {AppComponent} from 'src/app/app.component';

describe('WettkampfbeendetComponent', () => {
  let component: WettkampfbeendetComponent;
  let fixture: ComponentFixture<WettkampfbeendetComponent>;
  let app: {fullscreen: boolean};

  beforeEach(async () => {
    app = {fullscreen: false};
    await TestBed.configureTestingModule({
      declarations: [WettkampfbeendetComponent],
      providers: [
        {provide: AppComponent, useValue: app}
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(WettkampfbeendetComponent);
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

  it('renders finished message when infos is set', () => {
    const mock: TabletSchusszettel = {
      status: 'WETTKAMPF_BEENDET' as any,
      eigenesTeam:    { teamId: 1, teamName: 'Team A' },
      gegnerischesTeam: { teamId: 2, teamName: 'Team B' },
      schuetzenMatchPunkte: [],
      schuetzeStammDaten: [],
      satzErgebnisse: [],
      matchErgebnis: [
        { teamId: 1, teamName: 'Team A', matchpunkte: 6 },
        { teamId: 2, teamName: 'Team B', matchpunkte: 2 }
      ],
      verfuegbareSchuetzen: []
    };
    component.infos = mock;
    fixture.detectChanges();

    const container = fixture.debugElement.query(By.css('.wettkampfbeendet-container'));
    expect(container).toBeTruthy();
    expect(container.nativeElement.textContent).toContain('Der Wettkampftag ist beendet');
  });

  it('still renders finished message when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.wettkampfbeendet-container'));
    expect(container).toBeTruthy();
  });
});
