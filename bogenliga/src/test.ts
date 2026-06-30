// This file is required by karma.conf.js and loads recursively all the .spec and framework files

import {Component, NO_ERRORS_SCHEMA} from '@angular/core';
import {getTestBed, TestBed} from '@angular/core/testing';
import {BrowserDynamicTestingModule, platformBrowserDynamicTesting} from '@angular/platform-browser-dynamic/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {TranslateModule} from '@ngx-translate/core';
import {StoreModule} from '@ngrx/store';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {AppComponent} from './app/app.component';
import 'zone.js/dist/zone-testing';

declare const require: any;

@Component({template: ''})
class TestRouteComponent {}

// First, initialize the Angular testing environment.
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting()
);

const originalConfigureTestingModule = TestBed.configureTestingModule.bind(TestBed);
TestBed.configureTestingModule = (moduleDef: any) => originalConfigureTestingModule({
  ...moduleDef,
  imports: [
    HttpClientTestingModule,
    RouterTestingModule.withRoutes([
      {path: 'error', component: TestRouteComponent},
      {path: '**', component: TestRouteComponent}
    ]),
    NoopAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule.forRoot(),
    StoreModule.forRoot({}),
    ...(moduleDef.imports || [])
  ],
  declarations: [
    TestRouteComponent,
    ...(moduleDef.declarations || [])
  ],
  providers: [
    {provide: AppComponent, useValue: {fullscreen: false}},
    {provide: MAT_DIALOG_DATA, useValue: {}},
    {
      provide: MatDialog,
      useValue: {
        open: () => ({afterClosed: () => ({subscribe: () => undefined})})
      }
    },
    {
      provide: MatDialogRef,
      useValue: {
        close: () => undefined,
        afterOpened: () => ({subscribe: () => undefined}),
        afterClosed: () => ({subscribe: () => undefined})
      }
    },
    ...(moduleDef.providers || [])
  ],
  schemas: [
    NO_ERRORS_SCHEMA,
    ...(moduleDef.schemas || [])
  ]
});
// Then we find all the tests.
const context = require.context('./', true, /\.spec\.ts$/);
// And load the modules.
context.keys().map(context);
