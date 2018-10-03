import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TranslateModule} from '@ngx-translate/core';
import {ButtonComponent} from './components/buttons/button/button.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  imports: [
    CommonModule,
    FormsModule
    // TranslateModule.forChild()
    ],
  exports: [
    TranslateModule,
    FormsModule,
    ButtonComponent],
  declarations: [ButtonComponent]
})
export class SharedModule {}
