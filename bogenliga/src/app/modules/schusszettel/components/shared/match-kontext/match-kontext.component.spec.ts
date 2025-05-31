import {strict as assert} from 'assert';
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
    assert.ok(component, 'Component instance should be truthy');
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
    assert.ok(text.includes('Alpha'), 'should display eigenesTeam.teamName');
    assert.ok(text.includes('Beta'),  'should display gegnerischesTeam.teamName');
  });

  it('should not render when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.match-kontext'));
    assert.equal(container, null, 'title-block should not be in DOM');
  });
});
