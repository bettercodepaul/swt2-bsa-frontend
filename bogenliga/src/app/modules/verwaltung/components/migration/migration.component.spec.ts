import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MigrationComponent } from './migration.component';


//TODO: Tests
describe('SyncdatenComponent', () => {
  let component: MigrationComponent;
  let fixture: ComponentFixture<MigrationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MigrationComponent]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MigrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
