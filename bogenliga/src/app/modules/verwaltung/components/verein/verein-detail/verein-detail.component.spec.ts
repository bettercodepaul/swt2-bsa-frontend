import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VereinDetailComponent} from './verein-detail.component';

describe('VereinDetailComponent', () => {
  let component: VereinDetailComponent;
  let fixture: ComponentFixture<VereinDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VereinDetailComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VereinDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
