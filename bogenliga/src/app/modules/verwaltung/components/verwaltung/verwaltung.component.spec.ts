import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {VerwaltungComponent} from './verwaltung.component';
import {NavbarComponent} from '../../../../components/navbar/navbar.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../home';
import {TranslateLoader, TranslateModule} from '@ngx-translate/core';
import {createTranslateLoader} from '../../../../app.module';
import {HttpClient} from '@angular/common/http';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {SharedModule} from '../../../shared';
import {UserDropdownComponent} from '../../../../components/navbar/components/user-dropdown/user-dropdown.component';

describe('VerwaltungComponent', () => {
  let component: VerwaltungComponent;
  let fixture: ComponentFixture<VerwaltungComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
        declarations: [
          NavbarComponent,
          UserDropdownComponent,
          VerwaltungComponent
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
    fixture = TestBed.createComponent(VerwaltungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
