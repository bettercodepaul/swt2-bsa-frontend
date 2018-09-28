import {async, TestBed} from '@angular/core/testing';

import { WettkampfdataService } from './wettkampfdata.service';
import {AppComponent} from '../../../app.component';
import {SidebarComponent} from '../../../components/sidebar/sidebar.component';
import {NavbarComponent} from '../../../components/navbar/navbar.component';
import {NotificationComponent} from '../../../components/notification';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../app.routing';
import {HomeModule} from '../../home/home.module';
import {LoginModule} from '../../login/login.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../shared/redux-store';
import {HttpClientModule} from '@angular/common/http';

describe('WettkampfdataService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

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
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule
      ]
    }).compileComponents();
  }));

  it('should be created', () => {
    const service: WettkampfdataService = TestBed.get(WettkampfdataService);
    expect(service).toBeTruthy();
  });
});
