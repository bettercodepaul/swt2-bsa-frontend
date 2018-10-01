import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OverviewComponent } from './overview.component';
import {RouterTestingModule} from '@angular/router/testing';
import {ROUTES} from '../../../../app.routing';
import {TranslateModule} from '@ngx-translate/core';
import {HomeModule} from '../../../home/home.module';
import {LoginModule} from '../../../login/login.module';
import {StoreModule} from '@ngrx/store';
import {APP_REDUCERS} from '../../../shared/redux-store';
import {HttpClientModule} from '@angular/common/http';
import {DebugElement} from '@angular/core';
import {By} from '@angular/platform-browser';

describe('OverviewComponent', () => {
  let component: OverviewComponent;
  let fixture: ComponentFixture<OverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OverviewComponent ],
      imports: [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        LoginModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('pagination with datacount 0 -> no pagination', () => {
    let pagination = fixture.debugElement.query(By.css('.my-4'));
    component.activePage = 1;
    component.maxOnPage = 10;
    component.calculatePagination(0);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.pagination'))).toBeFalsy();
  });

  it('pagination with datacount > 0 -> pagination visible', () => {
    let pagination = fixture.debugElement.query(By.css('.my-4'));
    component.activePage = 1;
    component.maxOnPage = 10;
    component.calculatePagination(15);
    fixture.detectChanges();
    expect(component.pageCount.length).toBe(2);
    expect(pagination).toBeTruthy();
  });


});
