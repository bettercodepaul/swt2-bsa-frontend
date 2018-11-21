import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WettkampfklasseOverviewComponent } from './wettkampfklasse-overview.component';

describe('WettkampfklasseOverviewComponent', () => {
  let component: WettkampfklasseOverviewComponent;
  let fixture: ComponentFixture<WettkampfklasseOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WettkampfklasseOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WettkampfklasseOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
