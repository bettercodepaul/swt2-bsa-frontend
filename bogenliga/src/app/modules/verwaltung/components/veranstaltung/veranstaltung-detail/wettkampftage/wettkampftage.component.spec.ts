import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {WettkampftageComponent} from './wettkampftage.component';

describe('LigaDetailComponent', () => {
  let component: WettkampftageComponent;
  let fixture: ComponentFixture<WettkampftageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [WettkampftageComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WettkampftageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
