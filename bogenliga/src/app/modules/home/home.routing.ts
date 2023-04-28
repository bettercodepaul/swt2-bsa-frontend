import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';

import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  UserNeuComponent,
  VereinDetailComponent, VereinOverviewComponent, WettkampfklasseDetailComponent, WettkampfklasseOverviewComponent
} from '@verwaltung/components';
import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard, VereinDetailGuard,
  VereinOverviewGuard,
  WettkampfklasseOverviewGuard
} from '@verwaltung/guards';
import {
  DsbMitgliedDetailPopUpComponent
} from '@verwaltung/components/dsb-mitglied/dsb-mitglied-detail-pop-up/dsb-mitglied-detail-pop-up.component';
import {VereineComponent} from '@vereine/components';
import {
  SchuetzenComponent
} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/schuetzen/schuetzen.component';
import {SchuetzenNeuGuard} from '@verwaltung/guards/schuetzen-neu.guard';
import {WkdurchfuehrungComponent} from '@wkdurchfuehrung/components';
import {
  MannschaftDetailComponent
} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/mannschaft-detail.component';
import {DsbMannschaftDetailGuard} from '@verwaltung/guards/dsb-mannschaft-detail.guard';



export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
];

export const BUTTON_ROUTES: Routes = [
  {path: 'Vereindetails', component: VereinDetailComponent, canActivate: [VereinOverviewGuard]},
  {path: 'wkdurchfuehrung', component: WkdurchfuehrungComponent},
  {path: 'dsbmitglieder', component: DsbMitgliedOverviewComponent, canActivate: [DsbMitgliedOverviewGuard]},
  {path: 'dsbmitglieder/add', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'wkdurchfuehrung', component: WkdurchfuehrungComponent},
  {path: 'vereine', component: VereinOverviewComponent, pathMatch: 'full', canActivate: [VereinOverviewGuard]},
  {path: 'vereine/:id', component: VereinDetailComponent, canActivate: [VereinDetailGuard]},
  {path: 'vereine/:id/:id', component: MannschaftDetailComponent, canActivate: [DsbMannschaftDetailGuard]},
  {path: 'vereine/:id/:id/:id', component: SchuetzenComponent, canActivate: [SchuetzenNeuGuard]}
];
