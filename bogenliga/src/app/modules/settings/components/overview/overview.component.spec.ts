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
    let pagination = fixture.debugElement.query(By.css('.my-4')).nativeElement;
    fixture.detectChanges();
    component.activePage = 1;
    component.maxOnPage = 10;
    component.calculatePagination(0);
    fixture.detectChanges();
    // expect(pagination.isDisplayed()).toBeFalsy()
    expect(fixture.debugElement.query(By.css('.my-4'))).toBeNull(); // ngif object is not rendered
  });

  it('pagination with datacount > 0 -> pagination visible', () => {
    let pagination = fixture.debugElement.query(By.css('.my-4'));
    fixture.detectChanges();
    component.activePage = 1;
    component.maxOnPage = 10;
    component.calculatePagination(15);
    fixture.detectChanges();
    expect(component.pageCount.length).toBe(2);
    expect(pagination).toBeTruthy();
  });

  it('sort Data By Key: ascending', () => {
    component.keyAscending = false;
    component.valueAscending = false;
    component.datas = [
      Object({key: 'Markus', value: '1'}),
      Object({key: 'Sarah', value: '2'}),
      Object({key: 'Cyril', value: '3'}),
      Object({key: 'Nelli', value: '4'}),
      Object({key: 'Vera', value: '6'}),
      Object({key: 'Anton', value: '7'}),
      Object({key: 'Mine', value: '8'}),
      Object({key: 'Jonte', value: '9'}),
      Object({key: 'Gloria', value: '10'})
    ];
    let orderedDatas = [
      Object({key: 'Anton', value: '7'}),
      Object({key: 'Cyril', value: '3'}),
      Object({key: 'Gloria', value: '10'}),
      Object({key: 'Jonte', value: '9'}),
      Object({key: 'Markus', value: '1'}),
      Object({key: 'Mine', value: '8'}),
      Object({key: 'Nelli', value: '4'}),
      Object({key: 'Sarah', value: '2'}),
      Object({key: 'Vera', value: '6'})
    ];
    component.sortDataByKey();
    expect(component.datas).toEqual(orderedDatas);
  });

  it('sort Data By Key: descending', () => {
    component.keyAscending = true;
    component.valueAscending = false;
    component.datas = [
      Object({key: 'Markus', value: '1'}),
      Object({key: 'Sarah', value: '2'}),
      Object({key: 'Cyril', value: '3'}),
      Object({key: 'Nelli', value: '4'}),
      Object({key: 'Vera', value: '6'}),
      Object({key: 'Anton', value: '7'}),
      Object({key: 'Mine', value: '8'}),
      Object({key: 'Jonte', value: '9'}),
      Object({key: 'Gloria', value: '10'})
    ];
    let orderedDatas = [
      Object({key: 'Vera', value: '6'}),
      Object({key: 'Sarah', value: '2'}),
      Object({key: 'Nelli', value: '4'}),
      Object({key: 'Mine', value: '8'}),
      Object({key: 'Markus', value: '1'}),
      Object({key: 'Jonte', value: '9'}),
      Object({key: 'Gloria', value: '10'}),
      Object({key: 'Cyril', value: '3'}),
      Object({key: 'Anton', value: '7'})
    ];
    component.sortDataByKey();
    expect(component.datas).toEqual(orderedDatas);
  });

  it('sort Data By Value: ascending', () => {
    component.keyAscending = false;
    component.valueAscending = false;
    component.datas = [
      Object({key: '1', value: 'Markus'}),
      Object({key: '2', value: 'Sarah'}),
      Object({key: '3', value: 'Cyril'}),
      Object({key: '4', value: 'Nelli'}),
      Object({key: '5', value: 'Vera'}),
      Object({key: '6', value: 'Anton'}),
      Object({key: '7', value: 'Mine'}),
      Object({key: '8', value: 'Jonte'}),
      Object({key: '9', value: 'Gloria'})
    ];
    let orderedDatas = [
      Object({key: '6', value: 'Anton'}),
      Object({key: '3', value: 'Cyril'}),
      Object({key: '9', value: 'Gloria'}),
      Object({key: '8', value: 'Jonte'}),
      Object({key: '1', value: 'Markus'}),
      Object({key: '7', value: 'Mine'}),
      Object({key: '4', value: 'Nelli'}),
      Object({key: '2', value: 'Sarah'}),
      Object({key: '5', value: 'Vera'})
    ];
    component.sortDataByValue();
    expect(component.datas).toEqual(orderedDatas);
  });

  it('sort Data By Value: descending', () => {
    component.keyAscending = false;
    component.valueAscending = true;
    component.datas = [
      Object({key: '1', value: 'Markus'}),
      Object({key: '2', value: 'Sarah'}),
      Object({key: '3', value: 'Cyril'}),
      Object({key: '4', value: 'Nelli'}),
      Object({key: '5', value: 'Vera'}),
      Object({key: '6', value: 'Anton'}),
      Object({key: '7', value: 'Mine'}),
      Object({key: '8', value: 'Jonte'}),
      Object({key: '9', value: 'Gloria'})
    ];
    let orderedDatas = [
      Object({key: '5', value: 'Vera'}),
      Object({key: '2', value: 'Sarah'}),
      Object({key: '4', value: 'Nelli'}),
      Object({key: '7', value: 'Mine'}),
      Object({key: '1', value: 'Markus'}),
      Object({key: '8', value: 'Jonte'}),
      Object({key: '9', value: 'Gloria'}),
      Object({key: '3', value: 'Cyril'}),
      Object({key: '6', value: 'Anton'})
    ];
    component.sortDataByValue();
    expect(component.datas).toEqual(orderedDatas);
  });
});
