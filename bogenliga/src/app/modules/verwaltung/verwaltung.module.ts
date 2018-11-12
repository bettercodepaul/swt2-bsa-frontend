import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, VerwaltungGuard, MannschaftOverviewGuard} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  MannschaftDetailComponent, MannschaftOverviewComponent,
  VerwaltungComponent
} from './components';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, MannschaftDetailComponent, MannschaftOverviewComponent],
  providers:    [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard]
})
export class VerwaltungModule {
}
