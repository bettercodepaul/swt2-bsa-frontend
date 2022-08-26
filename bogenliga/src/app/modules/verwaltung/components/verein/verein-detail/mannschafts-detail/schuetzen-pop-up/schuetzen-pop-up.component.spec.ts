import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchuetzenPopUpComponent } from './schuetzen-pop-up.component';

describe('SchuetzenPopUpComponent', () => {
  let component: SchuetzenPopUpComponent;
  let fixture: ComponentFixture<SchuetzenPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SchuetzenPopUpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SchuetzenPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
