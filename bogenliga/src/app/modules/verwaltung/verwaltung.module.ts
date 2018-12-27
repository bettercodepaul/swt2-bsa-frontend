import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {FormsModule} from '@angular/forms';
import {VERWALTUNG_ROUTES} from './verwaltung.routing';
import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, BenutzerDetailGuard, BenutzerOverviewGuard, VerwaltungGuard} from './guards';
import {DsbMitgliedDetailComponent, DsbMitgliedOverviewComponent, BenutzerDetailComponent, BenutzerOverviewComponent, VerwaltungComponent} from './components';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(VERWALTUNG_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [VerwaltungComponent, DsbMitgliedOverviewComponent, DsbMitgliedDetailComponent, BenutzerOverviewComponent, BenutzerDetailComponent],
  providers:    [VerwaltungGuard, DsbMitgliedOverviewGuard, DsbMitgliedDetailGuard, BenutzerOverviewGuard, BenutzerDetailGuard]
})
export class VerwaltungModule {
}
