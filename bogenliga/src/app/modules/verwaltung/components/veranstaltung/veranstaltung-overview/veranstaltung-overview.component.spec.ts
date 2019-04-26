import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VeranstaltungOverviewComponent} from './veranstaltung-overview.component';

describe('LigaOverviewComponent', () => {
  let component: VeranstaltungOverviewComponent;
  let fixture: ComponentFixture<VeranstaltungOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VeranstaltungOverviewComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeranstaltungOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
