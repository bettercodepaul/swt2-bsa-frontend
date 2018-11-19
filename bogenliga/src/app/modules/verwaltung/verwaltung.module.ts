import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, VerwaltungGuard, DsbMannschaftOverviewGuard, DsbMannschaftDetailGuard,  WettkampfklasseDetailGuard, WettkampfklasseOverviewGuard} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  DsbMannschaftDetailComponent, DsbMannschaftOverviewComponent,
  WettkampfklasseDetailComponent, WettkampfklasseOverviewComponent
  VerwaltungComponent
} from './components';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, DsbMannschaftDetailComponent, DsbMannschaftOverviewComponent, WettkampfklasseOverviewComponent, WettkampfklasseDetailComponent],
  providers:    [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard, DsbMannschaftOverviewGuard, DsbMannschaftDetailGuard, WettkampfklasseOverviewGuard, WettkampfklasseDetailGuard]
})
export class VerwaltungModule {
}
