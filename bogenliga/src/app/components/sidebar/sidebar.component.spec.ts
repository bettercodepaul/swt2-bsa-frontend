import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidebarComponent } from './sidebar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../app.routing';
import {HomeModule} from '../../modules/home/home.module';
import {LoginModule} from '../../modules/login/login.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../app.module';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../modules/shared/redux-store';
import {SharedModule} from '../../modules/shared/shared.module';
import {SettingsModule} from '../../modules/settings/settings.module';
import {WettkampfModule} from '../../modules/wettkampf/wettkampf.module';
import {FormsModule} from '@angular/forms';
import {SidebarItemComponent} from './components/sidebar-item/sidebar-item.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        SidebarItemComponent ],
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
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
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
