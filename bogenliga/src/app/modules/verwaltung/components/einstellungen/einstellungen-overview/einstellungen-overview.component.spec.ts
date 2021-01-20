import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EinstellungenOverviewComponent } from './einstellungen-overview.component';

describe('EinstellungenOverviewComponent', () => {
  let component: EinstellungenOverviewComponent;
  let fixture: ComponentFixture<EinstellungenOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [EinstellungenOverviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EinstellungenOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
