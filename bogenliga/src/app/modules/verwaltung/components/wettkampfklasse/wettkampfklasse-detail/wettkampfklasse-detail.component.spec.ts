import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WettkampfklasseDetailComponent } from './wettkampfklasse-detail.component';

describe('WettkampfklasseDetailComponent', () => {
  let component: WettkampfklasseDetailComponent;
  let fixture: ComponentFixture<WettkampfklasseDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WettkampfklasseDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WettkampfklasseDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
