import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, VerwaltungGuard} from './guards';
import {DsbMitgliedDetailComponent, DsbMitgliedOverviewComponent, VerwaltungComponent} from './components';
import { WettkampfklasseOverviewComponent } from './components/wettkampfklasse/wettkampfklasse-overview/wettkampfklasse-overview.component';
import { WettkampfklasseDetailComponent } from './components/wettkampfklasse/wettkampfklasse-detail/wettkampfklasse-detail.component';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, WettkampfklasseOverviewComponent, WettkampfklasseDetailComponent],
  providers:    [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard]
})
export class VerwaltungModule {
}
