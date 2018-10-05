import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SportjahresplanComponent } from './sportjahresplan.component';

describe('SportjahresplanComponent', () => {
  let component: SportjahresplanComponent;
  let fixture: ComponentFixture<SportjahresplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SportjahresplanComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportjahresplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
