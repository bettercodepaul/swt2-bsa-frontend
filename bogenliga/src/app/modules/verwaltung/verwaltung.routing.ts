import {Routes} from '@angular/router';

import {
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VeranstaltungDetailComponent,
  VeranstaltungOverviewComponent,
} from './components';
import {
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VeranstaltungDetailGuard,
  VeranstaltungOverviewGuard,
} from './guards';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path: 'dsbmitglieder',
    component: DsbMitgliedOverviewComponent,
    pathMatch: 'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]}
  ,
  {
    path: 'benutzer',
    component: BenutzerOverviewComponent,
    pathMatch: 'full',
    canActivate: [BenutzerOverviewGuard]
  },
  {path: 'benutzer/add', component: BenutzerNeuComponent, canActivate: [BenutzerNeuGuard]}
  ,
  {path: 'benutzer/:id', component: BenutzerDetailComponent, canActivate: [BenutzerDetailGuard]},
  {
    path: 'klassen',
    component: WettkampfklasseOverviewComponent,
    pathMatch: 'full',
    canActivate: [WettkampfklasseOverviewGuard]
  },
  {path: 'klassen/:id', component: WettkampfklasseDetailComponent, canActivate: [WettkampfklasseDetailGuard]},
  {
    path: 'vereine',
    component: VereinOverviewComponent,
    pathMatch: 'full',
    canActivate: [VereinOverviewGuard]
  },
  {path: 'vereine/:id', component: VereinDetailComponent, canActivate: [VereinDetailGuard]},
  {
    path: 'liga',
    component: LigaOverviewComponent,
    pathMatch: 'full',
    canActivate: [LigaOverviewGuard]
  },
  {path: 'liga/:id', component: LigaDetailComponent, canActivate: [LigaDetailGuard]},
  {
    path: 'veranstaltung',
    component: VeranstaltungOverviewComponent,
    pathMatch: 'full',
    canActivate: [VeranstaltungOverviewGuard]
  },
  {path: 'veranstaltung/:id', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]}
];
