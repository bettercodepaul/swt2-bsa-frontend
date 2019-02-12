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
  BenutzerOverviewGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VereinOverviewGuard,
  VereinDetailGuard,
  LigaOverviewGuard,
  LigaDetailGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  BenutzerDetailComponent,
  BenutzerOverviewComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VerwaltungComponent,
  VereinOverviewComponent,
  VereinDetailComponent,
  LigaOverviewComponent,
  LigaDetailComponent
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
    WettkampfklasseDetailComponent,
    WettkampfklasseOverviewComponent,
    VereinDetailComponent,
    VereinOverviewComponent,
    LigaDetailComponent,
    LigaOverviewComponent
  ],
  providers:    [
    VerwaltungGuard,
    DsbMitgliedOverviewGuard,
    DsbMitgliedDetailGuard,
    DsbMannschaftOverviewGuard,
    DsbMannschaftDetailGuard,
    BenutzerOverviewGuard,
    BenutzerDetailGuard,
    WettkampfklasseOverviewGuard,
    WettkampfklasseDetailGuard,
    VereinOverviewGuard,
    VereinDetailGuard,
    LigaOverviewGuard,
    LigaDetailGuard
  ]
})
export class VerwaltungModule {
}
