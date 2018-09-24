import {ModuleWithProviders, NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';

import { TranslateModule } from '@ngx-translate/core';
import {HttpModule} from '@angular/http';
import {HttpClientModule} from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule
    // TranslateModule.forChild()
    ],
  exports: [TranslateModule ],
  declarations: []
})
export class SharedModule {}
