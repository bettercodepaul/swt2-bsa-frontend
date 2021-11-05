import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EinstellungenDetailComponent } from './einstellungen-detail.component';


describe('EinstellungenDetailComponent', () => {
  let component: EinstellungenDetailComponent;
  let fixture: ComponentFixture<EinstellungenDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EinstellungenDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EinstellungenDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
