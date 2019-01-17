import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LigaDetailComponent } from './liga-detail.component';

describe('LigaDetailComponent', () => {
  let component: LigaDetailComponent;
  let fixture: ComponentFixture<LigaDetailComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LigaDetailComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LigaDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
