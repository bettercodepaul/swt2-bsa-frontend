import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NavbarComponent } from './navbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../app.routing';
import {HomeModule} from '../../modules/home/home.module';
import {LoginModule} from '../../modules/login/login.module';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../modules/shared/redux-store';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {createTranslateLoader} from '../../app.module';
import {SharedModule} from '../../modules/shared/shared.module';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot({
          loader: {
            provide: TranslateLoader,
            useFactory: createTranslateLoader,
            deps: [HttpClient]
          }
        }),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        SharedModule
      ]
    },
      )
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
