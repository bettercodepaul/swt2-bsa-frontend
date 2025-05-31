import {strict as assert} from 'assert';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Maske4ZustandComponent} from './maske4zustand.component';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {By} from '@angular/platform-browser';

describe('Maske4ZustandComponent', () => {
  let component: Maske4ZustandComponent;
  let fixture: ComponentFixture<Maske4ZustandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [Maske4ZustandComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(Maske4ZustandComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    assert.ok(component);
  });

  it('renders scores and next passe correctly', () => {
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

    // Next passe = 3
    const passeEl = fixture.debugElement.query(By.css('.passe-info p')).nativeElement;
    assert.ok(passeEl.textContent.includes('3'), 'should show next passe = 3');

    // Scores
    const dls = fixture.debugElement.queryAll(By.css('dl dd'));
    const alphaScore = dls[0].nativeElement.textContent.trim();
    const betaScore = dls[1].nativeElement.textContent.trim();
    assert.equal(alphaScore, '2');
    assert.equal(betaScore, '0');
  });

  it('does not render when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.maske4-zustand'));
    assert.equal(container, null);
  });
});
