import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BahnenComponent } from './bahnen.component';

describe('BahnenComponent', () => {
  let component: BahnenComponent;
  let fixture: ComponentFixture<BahnenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BahnenComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BahnenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
