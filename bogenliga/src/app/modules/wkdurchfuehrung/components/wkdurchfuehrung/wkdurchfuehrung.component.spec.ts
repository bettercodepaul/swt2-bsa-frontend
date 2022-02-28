import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientModule} from '@angular/common/http';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {ROUTES} from '../../../../app.routing';
import {HomeModule} from '@home/home.module';
import {APP_REDUCERS} from '@shared/redux-store';
import {SharedModule} from '@shared/shared.module';
import {WkdurchfuehrungComponent} from './wkdurchfuehrung.component';
import {LigatabelleComponent} from 'src/app/modules/ligatabelle/components/ligatabelle/ligatabelle.component';

describe('WkdurchfuehrungComponent', () => {
  let component: WkdurchfuehrungComponent;
  let fixture: ComponentFixture<WkdurchfuehrungComponent>;

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
    fixture = TestBed.createComponent(WkdurchfuehrungComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
