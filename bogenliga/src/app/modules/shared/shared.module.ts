import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {ButtonComponent} from './components/buttons';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CurrentUserService} from './services/current-user';
import {AlertComponent} from './components/alerts';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    // TranslateModule.forChild()
    ],
  exports: [
    TranslateModule,
    FormsModule,
    HttpClientModule,
    ButtonComponent,
    AlertComponent],
  declarations: [ButtonComponent, AlertComponent]
})
export class SharedModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [CurrentUserService]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
