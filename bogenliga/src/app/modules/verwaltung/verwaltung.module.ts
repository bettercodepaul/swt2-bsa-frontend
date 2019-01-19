import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {
  VerwaltungGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  WettkampfklasseOverviewGuard,
  WettkampfklasseDetailGuard,
  VereinOverviewGuard,
  VereinDetailGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
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
  declarations: [
    VerwaltungComponent,
    DsbMitgliedOverviewComponent,
    DsbMitgliedDetailComponent,
    DsbMannschaftDetailComponent,
    DsbMannschaftOverviewComponent,
    BenutzerOverviewComponent,
    BenutzerDetailComponent,
    BenutzerNeuComponent,
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
    BenutzerOverviewGuard,
    BenutzerDetailGuard,
    BenutzerNeuGuard,
    WettkampfklasseDetailGuard,
    VereinOverviewGuard,
    VereinDetailGuard
  ]
})
export class VerwaltungModule {
}
