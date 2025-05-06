import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WettkampfleiterTabletViewComponent } from './wettkampfleiter-tablet-view.component';

describe('WettkampfleiterTabletViewComponent', () => {
  let component: WettkampfleiterTabletViewComponent;
  let fixture: ComponentFixture<WettkampfleiterTabletViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ WettkampfleiterTabletViewComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WettkampfleiterTabletViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
