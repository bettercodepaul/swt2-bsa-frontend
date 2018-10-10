import { WettkampfModule } from './wettkampf.module';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from '../../app.component';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {NotificationComponent} from '../../components/notification';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeModule} from '../home/home.module';
import {LoginModule} from '../login/login.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../shared/redux-store';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {SharedModule} from "../shared/shared.module";

describe('SettingsModule', () => {
  let wettkampfModule: WettkampfModule;
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        NotificationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(WETTKAMPF_ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        WettkampfModule,
        SharedModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    wettkampfModule = new WettkampfModule();
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create an instance', () => {
    expect(wettkampfModule).toBeTruthy();
  });
});
