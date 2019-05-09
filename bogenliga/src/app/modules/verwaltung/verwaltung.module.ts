import {CommonModule} from '@angular/common';
import {ModuleWithProviders, NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
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
  WettkampfklasseOverviewComponent
} from './components';
import {
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
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
  WettkampfklasseOverviewGuard
} from './guards';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {MannschaftDetailComponent} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/mannschaft-detail.component';
import {DsbMannschaftDetailGuard} from '@verwaltung/guards/dsb-mannschaft-detail.guard';

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
    BenutzerDetailComponent,
    BenutzerNeuComponent,
    BenutzerOverviewComponent,
    WettkampfklasseOverviewComponent,
    WettkampfklasseDetailComponent,
    VereinDetailComponent,
    VereinOverviewComponent,
    LigaDetailComponent,
    LigaOverviewComponent,
    RegionDetailComponent,
    RegionOverviewComponent,
    MannschaftDetailComponent
  ]
})
export class VerwaltungModule {

  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        VerwaltungGuard,
        DsbMitgliedOverviewGuard,
        DsbMitgliedDetailGuard,
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
        RegionDetailGuard,
        RegionOverviewGuard
      ]
    };
  }

  static forChild(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: []
    };
  }
}
