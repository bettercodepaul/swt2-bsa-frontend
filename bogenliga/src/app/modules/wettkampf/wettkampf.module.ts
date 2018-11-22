import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared';
import {RouterModule} from '@angular/router';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {FormsModule} from '@angular/forms';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkampfGuard} from './guards/wettkampf.guard';
import { SetzlisteComponent } from './components/setzliste/setzliste.component';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(WETTKAMPF_ROUTES),
    SharedModule,
    FormsModule,
  ],
  declarations: [WettkaempfeComponent, SetzlisteComponent],
  providers:    [WettkampfGuard]
})
export class WettkampfModule {
}
