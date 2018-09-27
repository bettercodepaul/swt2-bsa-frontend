import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {FormsModule} from '@angular/forms';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(WETTKAMPF_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [WettkaempfeComponent]
})
export class WettkampfModule {}
