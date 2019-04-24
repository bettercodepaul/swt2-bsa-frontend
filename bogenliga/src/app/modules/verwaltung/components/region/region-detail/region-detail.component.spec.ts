import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegionDetailComponent } from './verein-detail.component';

describe('VereinDetailComponent', () => {
  let component: RegionDetailComponent;
  let fixture: ComponentFixture<RegionDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RegionDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegionDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
