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
import {NgModuleFactoryLoader} from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {WettkampfModule} from './modules/wettkampf/wettkampf.module';
import {SharedModule} from './modules/shared/shared.module';


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
        SettingsModule,
        WettkampfModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        SharedModule
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

  it('navigate to "wettkaempfe" takes you to /wettkaempfe', fakeAsync(() => {
    router.initialNavigation();
    const loader = TestBed.get(NgModuleFactoryLoader);
    loader.stubbedModules = {lazyModule: WettkampfModule};
    router.resetConfig([
      {path: 'wettkaempfe', loadChildren: 'lazyModule'},
    ]);
    spyOn(loader, 'load').and.callThrough();
    router.navigate(['wettkaempfe']);
    tick();
    expect(location.path()).toBe('/wettkaempfe/wettkaempfe');
    expect(loader.load.calls.count()).toBe(1);
  }));

  it('navigate to "settings" takes you to /settings/overview', fakeAsync(() => {
    router.initialNavigation();
    const loader = TestBed.get(NgModuleFactoryLoader);
    loader.stubbedModules = {lazyModule: SettingsModule};
    router.resetConfig([
      {path: 'settings', loadChildren: 'lazyModule'},
    ]);
    spyOn(loader, 'load').and.callThrough();
    router.navigate(['settings']);
    tick();
    expect(location.path()).toBe('/settings/overview');
    expect(loader.load.calls.count()).toBe(1);
  }));

  it('navigate to "settings/details" takes you to /settings/details', fakeAsync(() => {
    router.initialNavigation();
    const loader = TestBed.get(NgModuleFactoryLoader);
    loader.stubbedModules = {lazyModule: SettingsModule};
    router.resetConfig([
      {path: 'settings', loadChildren: 'lazyModule'},
    ]);
    spyOn(loader, 'load').and.callThrough();
    router.navigate(['settings/details']);
    tick();
    expect(location.path()).toBe('/settings/details');
    expect(loader.load.calls.count()).toBe(1);
  }));
});
