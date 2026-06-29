import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MatchKontextComponent} from './match-kontext.component';
import {By} from '@angular/platform-browser';
import {TabletSchusszettel} from '@schusszettel/models/tablet-schusszettel.model';


describe('MatchKontextComponent', () => {
  let component: MatchKontextComponent;
  let fixture: ComponentFixture<MatchKontextComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MatchKontextComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(MatchKontextComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should render team name and opponent when infos is provided', () => {
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

    const dl = fixture.debugElement.query(By.css('dl'));
    const text = dl.nativeElement.textContent;
    expect(text).toContain('Alpha');
    expect(text).toContain('Beta');
  });

  it('should not render when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.match-context'));
    expect(container).toBeNull();
  });
});
