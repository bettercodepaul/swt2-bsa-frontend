import {TestBed, async, fakeAsync, tick} from '@angular/core/testing';
import { AppComponent } from './app.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from './app.routing';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NotificationComponent} from './components/notification';
import {HomeModule} from './modules/home/home.module';
import {LoginModule} from './modules/login/login.module';
import {TranslateModule, TranslatePipe, TranslateService} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from './modules/shared/redux-store';
import {Router} from '@angular/router';
import {Location} from '@angular/common';
import {SettingsModule} from './modules/settings/settings.module';
import {Component, NgModule, NgModuleFactoryLoader} from '@angular/core';


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
        NotificationComponent
      ],
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS)
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

  it(`should have as title 'bla'`, async(() => {
    const app = fixture.debugElement.componentInstance;
    expect(app.title).toEqual('bla');
  }));

  it('navigate to "" redirects you to /home', fakeAsync(() => {
    router.initialNavigation();
    router.navigate(['']);
    tick();
    expect(location.path()).toBe('/home');
  }));

  it('navigate to "home" takes you to /home', fakeAsync(() => {
    router.initialNavigation();
    router.navigate(['home']);
    tick();
    expect(location.path()).toBe('/home');
  }));

  it('navigate to "login" takes you to /login', fakeAsync(() => {
    router.initialNavigation();
    router.navigate(['login']);
    tick();
    expect(location.path()).toBe('/login');
  }));

  // Test naviagtion to wettkaempfe

  // Test navigation to settings
});
