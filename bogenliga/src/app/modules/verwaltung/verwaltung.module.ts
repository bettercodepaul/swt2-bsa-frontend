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
  LigaDetailGuard,
  LigaOverviewGuard,
  SportjahrLigaAuswahlGuard,
  SportjahrOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard
} from './guards';
import {
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  SportjahrLigaAuswahlComponent,
  SportjahrOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent
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
