import {Routes} from '@angular/router';

import {
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard
} from './guards';
import {
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent
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
  {path: 'dsbmitglieder/:id', component: DsbMitgliedDetailComponent, canActivate: [DsbMitgliedDetailGuard]}
  ,
  {path: 'klassen/:id', component: WettkampfklasseDetailComponent, canActivate: [WettkampfklasseDetailGuard]}
  ,
  { path: 'liga', component:   LigaOverviewComponent, canActivate: [LigaOverviewGuard]}
  ,
  { path: 'liga/:id', component : LigaDetailComponent, canActivate : [LigaDetailGuard]}
];
