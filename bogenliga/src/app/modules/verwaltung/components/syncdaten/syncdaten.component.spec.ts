import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SyncdatenComponent } from './syncdaten.component';


//TODO: Tests
describe('SyncdatenComponent', () => {
  let component: SyncdatenComponent;
  let fixture: ComponentFixture<SyncdatenComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SyncdatenComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SyncdatenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
