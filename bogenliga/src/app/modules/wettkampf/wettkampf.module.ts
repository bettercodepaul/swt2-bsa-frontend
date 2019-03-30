import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {SetzlisteComponent} from './components/setzliste-old/setzliste.component';
import {SetzlisteDownloadComponent, WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkampfGuard} from './guards/wettkampf.guard';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(WETTKAMPF_ROUTES),
    SharedModule,
    FormsModule,
  ],
  declarations: [WettkaempfeComponent, SetzlisteComponent, SetzlisteDownloadComponent],
  providers:    [WettkampfGuard]
})
export class WettkampfModule {
}
