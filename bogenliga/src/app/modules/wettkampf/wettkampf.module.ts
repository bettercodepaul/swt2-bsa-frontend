import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {SetzlisteDownloadComponent, SchusszettelDownloadComponent, WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkampfGuard} from './guards/wettkampf.guard';
import {WETTKAMPF_ROUTES} from './wettkampf.routing';
import {MeldezettelDownloadComponent} from '@wettkampf/components/meldezettel-download/meldezettel-download.component';
import {BogenkrolllisteDownloadComponent} from '@wettkampf/components/bogenkontrollliste-download/bogenkrollliste-download.component';


@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(WETTKAMPF_ROUTES),
    SharedModule,
    FormsModule,
  ],
  declarations: [WettkaempfeComponent, SetzlisteDownloadComponent, SchusszettelDownloadComponent, MeldezettelDownloadComponent, BogenkrolllisteDownloadComponent],
  providers:    [WettkampfGuard]
})
export class WettkampfModule {
}
