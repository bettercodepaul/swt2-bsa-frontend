import { SharedModule } from './../../../shared/shared.module';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WettkaempfeComponent } from './wettkaempfe.component';

describe('WettkaempfeComponent', () => {
  let component: WettkaempfeComponent;
  let fixture: ComponentFixture<WettkaempfeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WettkaempfeComponent ],
      imports: [ SharedModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WettkaempfeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
