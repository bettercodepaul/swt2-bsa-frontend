import {strict as assert} from 'assert';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {WettkampfbeendetComponent} from './wettkampfbeendet.component';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {MatButtonModule} from '@angular/material/button';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('WettkampfbeendetComponent', () => {
  let component: WettkampfbeendetComponent;
  let fixture: ComponentFixture<WettkampfbeendetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatButtonModule, NoopAnimationsModule],
      declarations: [WettkampfbeendetComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture   = TestBed.createComponent(WettkampfbeendetComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    assert.ok(component);
  });

  it('renders final match points table when infos is set', () => {
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

    const rows = fixture.debugElement.queryAll(By.css('tbody tr'));
    assert.equal(rows.length, 2, 'should render two rows');

    const firstRowCells = rows[0].queryAll(By.css('td'));
    assert.equal(firstRowCells[0].nativeElement.textContent.trim(), 'Team A');
    assert.equal(firstRowCells[1].nativeElement.textContent.trim(), '6');
  });

  it('does not render anything when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.wettkampfbeendet-container'));
    assert.equal(container, null);
  });

  it('reloads when button clicked', () => {
    component.infos = {} as any;
    fixture.detectChanges();

    let clicked = false;
    // override reload to track
    component.reload = () => (clicked = true);

    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    btn.click();
    assert.ok(clicked, 'reload() should have been called');
  });
});
