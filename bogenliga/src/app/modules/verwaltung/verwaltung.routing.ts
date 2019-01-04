import {Routes} from '@angular/router';

import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  BenutzerDetailGuard,
  BenutzerOverviewGuard,
  VerwaltungGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  BenutzerDetailComponent,
  BenutzerOverviewComponent,
  VerwaltungComponent
} from './components';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path:        'dsbmitglieder',
    component:   DsbMitgliedOverviewComponent,
    pathMatch:   'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {
    path:        'benutzer',
    component:   BenutzerOverviewComponent,
    pathMatch:   'full',
    canActivate: [BenutzerOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'benutzer/:id', component: BenutzerDetailComponent, canActivate: [BenutzerDetailGuard]},
];

