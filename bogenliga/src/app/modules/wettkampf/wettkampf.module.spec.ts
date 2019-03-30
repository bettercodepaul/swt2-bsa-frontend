import {Location} from '@angular/common';
import {async, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {AppComponent} from '../../app.component';
import {UserDropdownComponent} from '../../components/navbar/components/user-dropdown/user-dropdown.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {NotificationComponent} from '../../components/notification';
import {SidebarItemComponent} from '../../components/sidebar/components/sidebar-item/sidebar-item.component';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {HomeModule} from '../home/home.module';
import {APP_REDUCERS} from '../shared/redux-store';
import {SharedModule} from '../shared/shared.module';
import {WettkampfModule} from './wettkampf.module';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';

describe('WettkampfModule', () => {
  let wettkampfModule: WettkampfModule;
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SidebarComponent,
        SidebarItemComponent,
        NavbarComponent,
        NotificationComponent,
        UserDropdownComponent
      ],
      imports:      [
        RouterTestingModule.withRoutes(WETTKAMPF_ROUTES),
        HomeModule,
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
