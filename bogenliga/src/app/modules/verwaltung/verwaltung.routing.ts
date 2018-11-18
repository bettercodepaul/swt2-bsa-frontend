import {Routes} from '@angular/router';

import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, VerwaltungGuard, WettkampfklasseOverviewGuard, WettkampfklasseDetailGuard} from './guards';
import {DsbMitgliedDetailComponent, DsbMitgliedOverviewComponent, VerwaltungComponent, WettkampfklasseOverviewComponent, WettkampfklasseDetailComponent} from './components';
import {VereinOverviewComponent} from './components/verein/verein-overview/verein-overview.component';
import {VereinOverviewGuard} from './guards/verein-overview.guard';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path:        'dsbmitglieder',
    component:   DsbMitgliedOverviewComponent,
    pathMatch:   'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {
    path:        'klassen',
    component:   WettkampfklasseOverviewComponent,
    pathMatch:   'full',
    canActivate: [WettkampfklasseOverviewGuard]
  },
  {
    path:        'vereine',
    component:   VereinOverviewComponent,
    pathMatch:   'full',
    canActivate: [VereinOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'klassen/:id', component: WettkampfklasseDetailComponent, canActivate: [WettkampfklasseDetailGuard]}
  //TODO add detail path
];
