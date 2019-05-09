import {Location} from '@angular/common';
import {HttpClientModule} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {AppComponent} from './app.component';
import {ROUTES} from './app.routing';
import {UserDropdownComponent} from './components/navbar/components/user-dropdown/user-dropdown.component';
import {NavbarComponent} from './components/navbar/navbar.component';
import {NotificationComponent} from './components/notification';
import {SidebarItemComponent} from './components/sidebar/components/sidebar-item/sidebar-item.component';
import {SidebarComponent} from './components/sidebar/sidebar.component';
import {HomeModule} from './modules/home/home.module';
import {APP_REDUCERS} from './modules/shared/redux-store';
import {SharedModule} from './modules/shared/shared.module';
import {WettkampfModule} from './modules/wettkampf/wettkampf.module';


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
