import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {
  UserDetailComponent,
  UserNeuComponent,
  UserOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  RegionDetailComponent,
  RegionOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VeranstaltungOverviewComponent,
  VeranstaltungDetailComponent,
  WettkampftageComponent,
  EinstellungenOverviewComponent,
  EinstellungenDetailComponent

} from './components';
import {
  UserDetailGuard,
  UserNeuGuard,
  UserOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
  RegionDetailGuard,
  RegionOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VeranstaltungDetailGuard,
  VeranstaltungOverviewGuard,
  WettkampftageGuard,
  SportjahrOverviewGuard,
  EinstellungenDetailGuard,
  EinstellungenOverviewGuard

} from './guards';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {MannschaftDetailComponent} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/mannschaft-detail.component';
import {DsbMannschaftDetailGuard} from '@verwaltung/guards/dsb-mannschaft-detail.guard';

import {SchuetzenComponent} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/schuetzen/schuetzen.component';
import {SchuetzenNeuGuard} from '@verwaltung/guards/schuetzen-neu.guard';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  declarations: [
    VerwaltungComponent,
    DsbMitgliedOverviewComponent,
    DsbMitgliedDetailComponent,
    UserDetailComponent,
    UserNeuComponent,
    UserOverviewComponent,
    WettkampfklasseOverviewComponent,
    WettkampfklasseDetailComponent,
    VereinDetailComponent,
    VereinOverviewComponent,
    LigaDetailComponent,
    LigaOverviewComponent,
    RegionDetailComponent,
    RegionOverviewComponent,
    MannschaftDetailComponent,
    SchuetzenComponent,
    VeranstaltungOverviewComponent,
    VeranstaltungDetailComponent,
    WettkampftageComponent,
    EinstellungenDetailComponent,
    EinstellungenOverviewComponent
  ]
})
export class VerwaltungModule {

  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [
        VerwaltungGuard,
        DsbMitgliedOverviewGuard,
        DsbMitgliedDetailGuard,
        DsbMannschaftDetailGuard,
        UserOverviewGuard,
        UserNeuGuard,
        UserDetailGuard,
        WettkampfklasseOverviewGuard,
        WettkampfklasseDetailGuard,
        VereinOverviewGuard,
        VereinDetailGuard,
        LigaOverviewGuard,
        LigaDetailGuard,
        RegionDetailGuard,
        RegionOverviewGuard,
        SchuetzenNeuGuard,
        VeranstaltungOverviewGuard,
        VeranstaltungDetailGuard,
        WettkampftageGuard,
        SportjahrOverviewGuard,
        EinstellungenDetailGuard,
        EinstellungenOverviewGuard
      ]
    };
  }

  static forChild(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
