import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {APP_REDUCERS} from '@shared/redux-store';
import {SharedModule} from '@shared/shared.module';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../../modules/home';
import {SettingsModule} from '../../../../modules/settings';
import {WettkampfModule} from '../../../../modules/wettkampf';
import {SidebarItemComponent} from './sidebar-item.component';

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
