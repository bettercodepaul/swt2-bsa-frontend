import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SportjahrOverviewComponent} from './sportjahr-overview.component';

describe('SportjahrOverviewComponent', () => {
  let component: SportjahrOverviewComponent;
  let fixture: ComponentFixture<SportjahrOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SportjahrOverviewComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportjahrOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
