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


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    TranslateModule.forChild()],
  exports: [
    TranslateModule,
    FormsModule,
    HttpClientModule,
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent],
  declarations: [
    ButtonComponent,
    AlertComponent,
    ModalDialogComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CurrentUserService, ErrorHandlingService, NotificationService, RestClient]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
