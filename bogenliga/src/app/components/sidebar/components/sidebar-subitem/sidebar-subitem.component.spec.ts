import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarSubitemComponent } from './sidebar-subitem.component';

describe('SidebarSubitemComponent', () => {
  let component: SidebarSubitemComponent;
  let fixture: ComponentFixture<SidebarSubitemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidebarSubitemComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarSubitemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
