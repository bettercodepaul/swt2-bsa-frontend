import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClient, HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../app.module';
import {ROUTES} from '../../app.routing';
import {HomeModule} from '../../modules/home/home.module';
import {APP_REDUCERS} from '../../modules/shared/redux-store';
import {SharedModule} from '../../modules/shared/shared.module';
import {UserDropdownComponent} from './components/user-dropdown/user-dropdown.component';
import {NavbarComponent} from './navbar.component';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;

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
