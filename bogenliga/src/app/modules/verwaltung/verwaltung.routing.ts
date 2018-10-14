import {Routes} from '@angular/router';

import {DsbMitgliedDetailGuard, DsbMitgliedOverviewGuard, VerwaltungGuard} from './guards';
import {DsbMitgliedDetailComponent, DsbMitgliedOverviewComponent, VerwaltungComponent} from './components';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path:        'dsbmitglieder',
    component:   DsbMitgliedOverviewComponent,
    pathMatch:   'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]}
];
