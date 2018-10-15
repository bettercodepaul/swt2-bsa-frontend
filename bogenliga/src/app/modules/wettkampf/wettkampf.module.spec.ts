import {WettkampfModule} from './wettkampf.module';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {async, TestBed} from '@angular/core/testing';
import {AppComponent} from '../../app.component';
import {SidebarComponent} from '../../components/sidebar/sidebar.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {NotificationComponent} from '../../components/notification';
import {RouterTestingModule} from '@angular/router/testing';
import {HomeModule} from '../home/home.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../shared/redux-store';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {SharedModule} from '../shared/shared.module';
import {SidebarItemComponent} from '../../components/sidebar/components/sidebar-item/sidebar-item.component';
import {UserDropdownComponent} from '../../components/navbar/components/user-dropdown/user-dropdown.component';

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
