import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  SportjahrLigaAuswahlGuard,
  SportjahrOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
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
  VereinDetailComponent,
  LigaOverviewComponent,
  LigaDetailComponent,
  SportjahrLigaAuswahlComponent,
  SportjahrOverviewComponent
} from './components';

@NgModule({
  imports:      [
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
    BenutzerDetailComponent,
    BenutzerNeuComponent,
    BenutzerOverviewComponent,
    WettkampfklasseOverviewComponent,
    WettkampfklasseDetailComponent,
    VereinDetailComponent,
    VereinOverviewComponent,
    LigaDetailComponent,
    LigaOverviewComponent,
    SportjahrLigaAuswahlComponent,
    SportjahrOverviewComponent
  ],
  providers: [
    VerwaltungGuard,
    DsbMitgliedOverviewGuard,
    DsbMitgliedDetailGuard,
    DsbMannschaftOverviewGuard,
    DsbMannschaftDetailGuard,
    BenutzerOverviewGuard,
    BenutzerNeuGuard,
    BenutzerDetailGuard,
    WettkampfklasseOverviewGuard,
    WettkampfklasseDetailGuard,
    VereinOverviewGuard,
    VereinDetailGuard,
    LigaOverviewGuard,
    LigaDetailGuard,
    SportjahrLigaAuswahlGuard,
    SportjahrOverviewGuard
  ]
})
export class VerwaltungModule {
}
