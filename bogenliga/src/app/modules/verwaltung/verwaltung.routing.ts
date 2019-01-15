import {Routes} from '@angular/router';

import {
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  VerwaltungGuard
} from './guards';
import {
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
  VerwaltungComponent
} from './components';
import {
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VereinOverviewGuard,
  VereinDetailGuard
} from './guards';
import {
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VereinOverviewComponent,
  VereinDetailComponent
} from './components';

export const VERWALTUNG_ROUTES: Routes = [
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path:        'dsbmitglieder',
    component:   DsbMitgliedOverviewComponent,
    pathMatch:   'full',
    canActivate: [DsbMitgliedOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]}
  ,
  {path: '', component: VerwaltungComponent, canActivate: [VerwaltungGuard]},
  {
    path: 'dsbmannschaft',
    component: DsbMannschaftOverviewComponent,
    pathMatch: 'full',
    canActivate: [DsbMannschaftOverviewGuard]
  },
  {path: 'dsbmannschaft/:id', component: DsbMannschaftDetailComponent, canActivate: [DsbMannschaftDetailGuard]},
  {
    path:        'klassen',
    component:   WettkampfklasseOverviewComponent,
    pathMatch:   'full',
    canActivate: [WettkampfklasseOverviewGuard]
  },
  {path: 'klassen/:id', component: WettkampfklasseDetailComponent, canActivate: [WettkampfklasseDetailGuard]},
  {
    path:        'vereine',
    component:   VereinOverviewComponent,
    pathMatch:   'full',
    canActivate: [VereinOverviewGuard]
  },
  {path: 'vereine/:id', component: VereinDetailComponent, canActivate: [VereinDetailGuard]}
  {
    path:        'benutzer',
    component:   BenutzerOverviewComponent,
    pathMatch:   'full',
    canActivate: [BenutzerOverviewGuard]
  },
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]},
  {path: 'benutzer/:id', component: BenutzerDetailComponent, canActivate: [BenutzerDetailGuard]},
  {path: 'benutzer/neu', component: BenutzerNeuComponent, canActivate: [BenutzerNeuGuard]},
];

