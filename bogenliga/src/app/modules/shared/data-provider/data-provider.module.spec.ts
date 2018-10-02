import { DataProviderModule } from './data-provider.module';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../app.routing';
import {HomeModule} from '../../home/home.module';
import {LoginModule} from '../../login/login.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../redux-store';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {TestBed} from '@angular/core/testing';
import {DetailsComponent} from '../../settings/components/details/details.component';

describe('DataProviderModule', () => {
  let dataProviderModule: DataProviderModule;

  beforeEach(() => {
    dataProviderModule = new DataProviderModule();
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        FormsModule
      ]
    })
      .compileComponents();
  });

  it('should create an instance', () => {
    expect(dataProviderModule).toBeTruthy();
  });
});
