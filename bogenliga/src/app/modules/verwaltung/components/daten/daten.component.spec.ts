import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DatenComponent } from './daten.component';

describe('DatenComponent', () => {
  let component: DatenComponent;
  let fixture: ComponentFixture<DatenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DatenComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
