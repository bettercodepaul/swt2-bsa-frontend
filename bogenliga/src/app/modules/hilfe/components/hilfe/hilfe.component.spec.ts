import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HilfeComponent } from './hilfe.component';

describe('ComponentsComponent', () => {
  let component: HilfeComponent;
  let fixture: ComponentFixture<HilfeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HilfeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HilfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
