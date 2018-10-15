import {async, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from './app.routing';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NotificationComponent} from './components/notification';
import {HomeModule} from './modules/home/home.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from './modules/shared/redux-store';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SettingsModule} from './modules/settings/settings.module';
import {NgModuleFactoryLoader} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {WettkampfModule} from './modules/wettkampf/wettkampf.module';
import {SharedModule} from './modules/shared/shared.module';
import {FormsModule} from '@angular/forms';
import {SidebarItemComponent} from './components/sidebar/components/sidebar-item/sidebar-item.component';
import {UserDropdownComponent} from './components/navbar/components/user-dropdown/user-dropdown.component';
import {VerwaltungModule} from './modules/verwaltung';
import {SportjahresplanModule} from './modules/sportjahresplan';


describe('AppComponent', () => {
  let location: Location;
  let router: Router;
  let fixture;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AppComponent,
        SidebarComponent,
        NavbarComponent,
        NotificationComponent,
        SidebarItemComponent,
        UserDropdownComponent
      ],
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
    }).compileComponents();
  }));

  beforeEach(() => {
    router = TestBed.get(Router);
    location = TestBed.get(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create the app', async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));
});
