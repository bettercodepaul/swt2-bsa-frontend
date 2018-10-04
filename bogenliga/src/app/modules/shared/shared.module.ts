import {ModuleWithProviders, NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {ButtonComponent} from './components/buttons/button/button.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {CurrentUserService} from './services/current-user/current-user.service';


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
    ButtonComponent],
  declarations: [ButtonComponent]
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
