import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';
import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {
  AlertComponent,
  BreadcrumbsComponent,
  ButtonComponent,
  ModalDialogComponent,
  PageHeadingComponent
} from './components';
import {RestClient} from './data-provider';
import * as SharedService from './services';
import * as LocalDataProvider from './local-data-provider/services';
import {StorageServiceModule} from 'angular-webstorage-service';

import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';

/*
 * define font awesome icon libraries
 */
library.add(fas, far, fab); // add all icon types


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forChild(),
    RouterModule,
    FontAwesomeModule,
    StorageServiceModule
  ],
  exports:      [
    TranslateModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent,
    PageHeadingComponent,
    BreadcrumbsComponent
  ],
  declarations: [
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent,
    PageHeadingComponent,
    BreadcrumbsComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
      providers: [
        SharedService.CurrentUserService,
        SharedService.ErrorHandlingService,
        SharedService.NotificationService,
        LocalDataProvider.LocalDataProviderService,
        LocalDataProvider.LocalStorageDataProvider,
        LocalDataProvider.SessionStorageDataProvider,
        RestClient
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
      providers: []
    };
  }
}
