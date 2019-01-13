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
  LigaOverviewGuard,
  SportjahrLigaAuswahlGuard
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
  LigaOverviewComponent,
  SportjahrLigaAuswahlComponent,
  SportjahrOverviewComponent
} from './components';
import {SportjahrOverviewGuard} from './guards/sportjahr-overview.guard';


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
    path:        'dsbmannschaft',
    component:   DsbMannschaftOverviewComponent,
    pathMatch:   'full',
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
    path:        'liga',
    component:   LigaOverviewComponent,
    pathMatch:   'full',
    canActivate: [LigaOverviewGuard]
  },
  {path: 'liga/:id', component: LigaDetailComponent, canActivate: [LigaDetailGuard]},
  {
    path: 'sportjahr',
    pathMatch:   'full',
    component: SportjahrLigaAuswahlComponent,

    canActivate: [SportjahrLigaAuswahlGuard]
  },
  {path: 'sportjahr/liga/:id', pathMatch: 'full', component: SportjahrOverviewComponent, canActivate: [SportjahrOverviewGuard]},
];
