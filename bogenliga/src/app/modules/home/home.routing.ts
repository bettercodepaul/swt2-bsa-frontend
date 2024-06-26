import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';

import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VeranstaltungDetailComponent,
  VeranstaltungOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
} from '@verwaltung/components';
import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard, VeranstaltungDetailGuard, VeranstaltungOverviewGuard, VereinDetailGuard,
  VereinOverviewGuard, VerwaltungGuard
} from '@verwaltung/guards';

import {
  SchuetzenComponent
} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/schuetzen/schuetzen.component';
import {SchuetzenNeuGuard} from '@verwaltung/guards/schuetzen-neu.guard';
import {WkdurchfuehrungComponent} from '@wkdurchfuehrung/components';
import {
  MannschaftDetailComponent
} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/mannschaft-detail.component';
import {DsbMannschaftDetailGuard} from '@verwaltung/guards/dsb-mannschaft-detail.guard';
import {VereineComponent} from '@vereine/components';
import {
  DsbMitgliedDetailPopUpComponent
} from '@verwaltung/components/dsb-mitglied/dsb-mitglied-detail-pop-up/dsb-mitglied-detail-pop-up.component';



export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'home/:id', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
  //{path: '**', component: HomeComponent, canActivate: [HomeGuard]}
];

export const BUTTON_ROUTES: Routes = [
  {path: 'dsbmitglieder', component: DsbMitgliedOverviewComponent, canActivate: [DsbMitgliedOverviewGuard]},
  {path: 'dsbmitglieder/add', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'vereine', component: VereinOverviewComponent, canActivate: [VereinOverviewGuard]},
  {path: 'vereine/id', component: VereinDetailComponent, canActivate: [VereinDetailGuard]},
  {path: 'vereine/:id/:id', component: MannschaftDetailComponent, canActivate: [DsbMannschaftDetailGuard]},
  {path: 'vereine/:id/:id/:id', component: SchuetzenComponent, canActivate: [SchuetzenNeuGuard]},
  {path: 'verwaltung', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {path: 'veranstaltung', component: VeranstaltungOverviewComponent, canActivate: [VeranstaltungOverviewGuard]},
  {path: 'veranstaltung/add', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]},
  {path: 'wkdurchfuehrung', component: WkdurchfuehrungComponent}
];
