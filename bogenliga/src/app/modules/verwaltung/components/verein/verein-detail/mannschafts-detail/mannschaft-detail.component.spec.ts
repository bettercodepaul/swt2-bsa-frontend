import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MannschaftDetailComponent } from './mannschaft-detail.component';

describe('VereinDetailComponent', () => {
  let component: MannschaftDetailComponent;
  let fixture: ComponentFixture<MannschaftDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MannschaftDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MannschaftDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
