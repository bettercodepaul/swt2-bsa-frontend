import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CurrentUserService} from './services/current-user';
import {AlertComponent, ButtonComponent, ModalDialogComponent} from './components';
import {RestClient} from './data-provider';
import {ErrorHandlingService} from './services/error-handling';
import {NotificationService} from './services/notification';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
/*
 * define font awesome icon libraries
 */
import {library} from '@fortawesome/fontawesome-svg-core';
import {fas} from '@fortawesome/free-solid-svg-icons';
import {fab} from '@fortawesome/free-brands-svg-icons';
import {far} from '@fortawesome/free-regular-svg-icons';

// Add an icon to the library for convenient access in other components
library.add(fas, far, fab); // add all icon types


@NgModule({
  imports:      [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forChild(),
    FontAwesomeModule
  ],
  exports:      [
    TranslateModule,
    FormsModule,
    HttpClientModule,
    FontAwesomeModule,
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent
  ],
  declarations: [
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent
  ]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
      providers: [CurrentUserService, ErrorHandlingService, NotificationService, RestClient]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule:  SharedModule,
      providers: []
    };
  }
}
