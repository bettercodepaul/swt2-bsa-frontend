import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';

import { DetailsComponent } from './details.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../home/home.module';
import {LoginModule} from '../../../login/login.module';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {DataService} from '../../services/data.service';
import {Data} from '../../types/data';
import {Observable} from 'rxjs';
import {SharedModule} from '../../../shared/shared.module';

describe('DetailsComponent', () => {
  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;
  let service: DataService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetailsComponent ],
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        FormsModule,
        SharedModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
    service = TestBed.get(DataService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('after saveNewData(), data should be reset', fakeAsync(() => {
    component.data.key = 'dummyKey';
    component.data.value = 'dummyValue';
    spyOn(service, 'addOne').and.callFake(function(): Observable<any> {
      return new Observable<any>(); // return is not important in this test -> function should not continue saving to backend
    });
    fixture.detectChanges();
    component.saveNewData();
    tick();
    fixture.detectChanges();
    expect(component.data.key).toEqual('');
    expect(component.data.value).toEqual('');
  }));
});
