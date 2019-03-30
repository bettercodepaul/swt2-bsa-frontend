import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {HttpClientModule} from '@angular/common/http';
import {FormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {StoreModule} from '@ngrx/store';
import {TranslateModule} from '@ngx-translate/core';
import {ROUTES} from '../../app.routing';
import {HomeModule} from '../../modules/home';
import {SettingsModule} from '../../modules/settings';
import {APP_REDUCERS} from '@shared/redux-store';
import {SharedModule} from '@shared/shared.module';
import {WettkampfModule} from '../../modules/wettkampf';
import {SidebarItemComponent} from './components/sidebar-item/sidebar-item.component';
import {SidebarComponent} from './sidebar.component';

describe('SidebarComponent', () => {
  let component: SidebarComponent;
  let fixture: ComponentFixture<SidebarComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SidebarComponent,
        SidebarItemComponent
      ],
      imports:      [
        RouterTestingModule.withRoutes(ROUTES),
        HomeModule,
        SettingsModule,
        WettkampfModule,
        TranslateModule.forRoot(),
        StoreModule.forRoot(APP_REDUCERS),
        HttpClientModule,
        SharedModule,
        HomeModule,
        WettkampfModule,
        FormsModule
      ]
    })
           .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
