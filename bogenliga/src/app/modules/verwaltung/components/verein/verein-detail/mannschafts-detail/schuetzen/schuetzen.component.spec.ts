import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SchuetzenComponent } from './schuetzen.component';

describe('VereinDetailComponent', () => {
  let component: SchuetzenComponent;
  let fixture: ComponentFixture<SchuetzenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SchuetzenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SchuetzenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
