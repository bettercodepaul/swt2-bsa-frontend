import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerwaltungComponent} from './verwaltung.component';

describe('VerwaltungComponent', () => {
  let component: VerwaltungComponent;
  let fixture: ComponentFixture<VerwaltungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerwaltungComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
