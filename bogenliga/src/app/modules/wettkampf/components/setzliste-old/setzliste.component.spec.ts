import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SetzlisteComponent} from './setzliste.component';

describe('SetzlisteComponent', () => {
  let component: SetzlisteComponent;
  let fixture: ComponentFixture<SetzlisteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SetzlisteComponent]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SetzlisteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
