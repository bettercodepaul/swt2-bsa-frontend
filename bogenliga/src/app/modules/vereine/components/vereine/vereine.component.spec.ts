import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VereineComponent } from './vereine.component';

describe('VereineComponent', () => {
  let component: VereineComponent;
  let fixture: ComponentFixture<VereineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VereineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VereineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
