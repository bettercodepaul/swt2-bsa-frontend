import {strict as assert} from 'assert';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {WarteBestaetigungComponent} from './warte-bestaetigung.component';
import {By} from '@angular/platform-browser';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

describe('WarteBestaetigungComponent', () => {
  let component: WarteBestaetigungComponent;
  let fixture: ComponentFixture<WarteBestaetigungComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatProgressSpinnerModule, NoopAnimationsModule],
      declarations: [WarteBestaetigungComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarteBestaetigungComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    assert.ok(component);
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
    assert.ok(spinner, 'mat-spinner should be in the DOM');

    // Expect the waiting message
    const msg = fixture.debugElement.query(By.css('.info-box p')).nativeElement.textContent;
    assert.ok(msg.includes('Waiting for the opponent'), 'should show waiting message');
  });

  it('emits refresh when button clicked', () => {
    component.infos = {} as any;
    fixture.detectChanges();

    let emitted = false;
    component.refresh.subscribe(() => (emitted = true));

    const btn = fixture.debugElement.query(By.css('button')).nativeElement;
    btn.click();
    assert.ok(emitted, 'should have emitted refresh event');
  });

  it('does not render anything when infos is null', () => {
    component.infos = null;
    fixture.detectChanges();
    const container = fixture.debugElement.query(By.css('.warte-container'));
    assert.equal(container, null);
  });
});
