import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, BenutzerDetailGuard, BenutzerNeuGuard, BenutzerOverviewGuard, VerwaltungGuard} from './guards';
import {DsbMitgliedDetailComponent, DsbMitgliedOverviewComponent, BenutzerDetailComponent, BenutzerNeuComponent, BenutzerOverviewComponent, VerwaltungComponent} from './components';
import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VereinOverviewGuard,
  VereinDetailGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VereinOverviewComponent,
  VereinDetailComponent
} from './components';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, BenutzerOverviewComponent, BenutzerDetailComponent, BenutzerNeuComponent],
  providers:    [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard, BenutzerOverviewGuard, BenutzerDetailGuard, BenutzerNeuGuard]
  declarations: [
    VerwaltungComponent,
    DsbMitgliedOverviewComponent,
    DsbMitgliedDetailComponent,
    DsbMannschaftDetailComponent,
    DsbMannschaftOverviewComponent,
    WettkampfklasseOverviewComponent,
    WettkampfklasseDetailComponent,
    VereinDetailComponent,
    VereinOverviewComponent
  ],
  providers:    [
    VerwaltungGuard,
    DsbMitgliedOverviewGuard,
    DsbMitgliedDetailGuard,
    DsbMannschaftOverviewGuard,
    DsbMannschaftDetailGuard,
    WettkampfklasseOverviewGuard,
    WettkampfklasseDetailGuard,
    VereinOverviewGuard,
    VereinDetailGuard
  ]
})
export class VerwaltungModule {
}
