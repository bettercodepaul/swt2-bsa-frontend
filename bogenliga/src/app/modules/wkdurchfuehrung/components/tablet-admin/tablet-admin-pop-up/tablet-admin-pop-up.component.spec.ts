import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TabletAdminPopUpComponent} from '@wkdurchfuehrung/components/tablet-admin/tablet-admin-pop-up/tablet-admin-pop-up.component';

describe('TabletAdminPopUpComponent', () => {
  let component: TabletAdminPopUpComponent;
  let fixture: ComponentFixture<TabletAdminPopUpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TabletAdminPopUpComponent]
    })
                 .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabletAdminPopUpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
