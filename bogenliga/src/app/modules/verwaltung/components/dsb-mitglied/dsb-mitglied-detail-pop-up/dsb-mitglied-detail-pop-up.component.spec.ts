import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DsbMitgliedDetailPopUpComponent } from './dsb-mitglied-detail-pop-up.component';

describe('DsbMitgliedDetailPopUpComponent', () => {
  let component: DsbMitgliedDetailPopUpComponent;
  let fixture: ComponentFixture<DsbMitgliedDetailPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DsbMitgliedDetailPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DsbMitgliedDetailPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
