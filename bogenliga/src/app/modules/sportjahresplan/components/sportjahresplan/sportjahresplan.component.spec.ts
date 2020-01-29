import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '../../../home/home.module';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {SharedModule} from '../../../shared/shared.module';
import {SportjahresplanComponent} from './sportjahresplan.component';
import {LigatabelleComponent} from 'src/app/modules/ligatabelle/components/ligatabelle/ligatabelle.component';

describe('SportjahresplanComponent', () => {
  let component: SportjahresplanComponent;
  let fixture: ComponentFixture<SportjahresplanComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LigatabelleComponent],
      imports:      [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        SharedModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SportjahresplanComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
