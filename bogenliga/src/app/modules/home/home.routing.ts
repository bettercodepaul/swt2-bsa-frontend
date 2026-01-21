import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';

import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VeranstaltungDetailComponent,
  VeranstaltungOverviewComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
} from '@verwaltung/components';
import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard, VeranstaltungDetailGuard, VeranstaltungOverviewGuard,
  VereinOverviewGuard, VerwaltungGuard
} from '@verwaltung/guards';

import {WkdurchfuehrungComponent} from '@wkdurchfuehrung/components';
import {LigaResolver} from "@shared/routing/resolvers/liga.resolver";

export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent,
    canActivate: [HomeGuard],
    resolve: { liga: LigaResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange'
  },
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
  // Optional: Redirect für alte /home/:id oder /home/liga (falls noch Links existieren)
  {path: 'home/:legacy', redirectTo: 'home'},
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
];

export const BUTTON_ROUTES: Routes = [
  {path: 'dsbmitglieder', component: DsbMitgliedOverviewComponent, canActivate: [DsbMitgliedOverviewGuard]},
  {path: 'dsbmitglieder/add', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'vereine', component: VereinOverviewComponent, canActivate: [VereinOverviewGuard]},
  {path: 'verwaltung', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {path: 'veranstaltung', component: VeranstaltungOverviewComponent, canActivate: [VeranstaltungOverviewGuard]},
  {path: 'veranstaltung/add', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]},
  {path: 'wkdurchfuehrung', component: WkdurchfuehrungComponent}
];
