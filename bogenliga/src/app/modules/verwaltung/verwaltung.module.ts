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
  DsbMitgliedOverviewGuard, SportjahrLigaAuswahlGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,

} from './guards';
import {
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent
} from './components';
import { LigaOverviewComponent } from './components/liga/liga-overview/liga-overview.component';
import { LigaDetailComponent } from './components/liga/liga-detail/liga-detail.component';
import {LigaDetailGuard} from './guards/liga-detail.guard';
import {LigaOverviewGuard} from './guards/liga-overview.guard';
import { SportjahrLigaAuswahlComponent } from './components/sportjahr/sportjahr-liga-auswahl/sportjahr-liga-auswahl.component';

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
    WettkampfklasseOverviewComponent,
    WettkampfklasseDetailComponent,
    LigaOverviewComponent,
    LigaDetailComponent,
    SportjahrLigaAuswahlComponent
  ],
  providers: [
    VerwaltungGuard,
    DsbMitgliedOverviewGuard,
    DsbMitgliedDetailGuard,
    DsbMannschaftOverviewGuard,
    DsbMannschaftDetailGuard,
    WettkampfklasseOverviewGuard,
    WettkampfklasseDetailGuard,
    LigaDetailGuard,
    LigaOverviewGuard,
    SportjahrLigaAuswahlGuard
  ]
})
export class VerwaltungModule {
}
