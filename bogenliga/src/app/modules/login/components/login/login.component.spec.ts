import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {LoginComponent} from './login.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../home/home.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {SharedModule} from '../../../shared/shared.module';
import {LocalDataProviderModule} from '../../../shared/local-data-provider/local-data-provider.module';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports:      [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        SharedModule,
        LocalDataProviderModule
      ]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
