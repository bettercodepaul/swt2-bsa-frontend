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
import {LigatabelleModule} from './ligatabelle.module';
import {LIGATABELLE_ROUTES} from './ligatabelle.routing';

describe('LigatabelleModule', () => {
  let ligatabelleModule: LigatabelleModule;
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
        RouterTestingModule.withRoutes(LIGATABELLE_ROUTES),
        HomeModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        LigatabelleModule,
        SharedModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    ligatabelleModule = new LigatabelleModule();
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
    fixture = TestBed.createComponent(AppComponent);
  });

  it('should create an instance', () => {
    expect(ligatabelleModule).toBeTruthy();
  });
});
