import {HttpClient} from '@angular/common/http';
import {async, TestBed} from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../app.module';
import {ROUTES} from '../../app.routing';
import {UserDropdownComponent} from '../../components/navbar/components/user-dropdown/user-dropdown.component';
import {NavbarComponent} from '../../components/navbar/navbar.component';
import {HomeModule} from '../home';
import {SharedModule} from '../shared';
import {APP_REDUCERS} from '../shared/redux-store';
import {VerwaltungModule} from './verwaltung.module';

describe('VerwaltungModule', () => {
  let verwaltungModule: VerwaltungModule;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          NavbarComponent,
          UserDropdownComponent
        ],
        imports:      [
          RouterTestingModule.withRoutes(ROUTES),
          HomeModule,
          TranslateModule.forRoot({
            loader: {
              provide:    TranslateLoader,
              useFactory: createTranslateLoader,
              deps:       [HttpClient]
            }
          }),
          StoreModule.forRoot(APP_REDUCERS),
          SharedModule
        ]
      },
    )
      .compileComponents();
  }));

  beforeEach(() => {
    verwaltungModule = new VerwaltungModule();
  });

  it('should create an instance', () => {
    expect(verwaltungModule).toBeTruthy();
  });
});
