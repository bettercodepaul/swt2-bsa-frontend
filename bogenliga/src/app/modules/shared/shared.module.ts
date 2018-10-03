import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {ButtonComponent} from './components/buttons/button/button.component';
import {FormsModule} from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';


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
export class SharedModule {}
