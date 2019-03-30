import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {ROUTES} from '../../../../app.routing';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {SharedModule} from '../../../shared/shared.module';
import {HomeComponent} from './home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports:      [
        RouterTestingModule.withRoutes(ROUTES),
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        SharedModule
      ]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
