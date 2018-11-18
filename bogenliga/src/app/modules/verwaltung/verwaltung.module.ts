import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent
} from './components';
import {VereinDetailComponent} from './components/verein/verein-detail/verein-detail.component';
import {VereinOverviewComponent} from './components/verein/verein-overview/verein-overview.component';
import {VereinOverviewGuard} from './guards/verein-overview.guard';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, WettkampfklasseOverviewComponent, WettkampfklasseDetailComponent, VereinDetailComponent, VereinOverviewComponent],
  providers: [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard, WettkampfklasseOverviewGuard, WettkampfklasseDetailGuard, VereinOverviewGuard]
})
export class VerwaltungModule {
}
