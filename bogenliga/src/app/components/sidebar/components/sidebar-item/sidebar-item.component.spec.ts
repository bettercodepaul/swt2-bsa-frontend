import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SidebarItemComponent} from './sidebar-item.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../../modules/home/home.module';
import {SettingsModule} from '../../../../modules/settings/settings.module';
import {WettkampfModule} from '../../../../modules/wettkampf/wettkampf.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../../../modules/shared/redux-store';
import {HttpClientModule} from '@angular/common/http';
import {SharedModule} from '../../../../modules/shared/shared.module';
import {FormsModule} from '@angular/forms';

describe('SidebarItemComponent', () => {
  let component: SidebarItemComponent;
  let fixture: ComponentFixture<SidebarItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SidebarItemComponent],
      imports:      [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        SettingsModule,
        WettkampfModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        SharedModule,
        HomeModule,
        WettkampfModule,
        FormsModule
      ]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
