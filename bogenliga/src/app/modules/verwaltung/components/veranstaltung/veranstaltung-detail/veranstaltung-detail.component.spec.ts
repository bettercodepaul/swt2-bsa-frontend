import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VeranstaltungDetailComponent} from './veranstaltung-detail.component';

describe('LigaDetailComponent', () => {
  let component: VeranstaltungDetailComponent;
  let fixture: ComponentFixture<VeranstaltungDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VeranstaltungDetailComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VeranstaltungDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
