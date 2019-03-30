import {Routes} from '@angular/router';

import {
  BenutzerDetailComponent,
  BenutzerNeuComponent,
  BenutzerOverviewComponent,
  DsbMannschaftDetailComponent,
  DsbMannschaftOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  SportjahrLigaAuswahlComponent,
  SportjahrOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent
} from './components';
import {
  BenutzerDetailGuard,
  BenutzerNeuGuard,
  BenutzerOverviewGuard,
  DsbMannschaftDetailGuard,
  DsbMannschaftOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
  SportjahrLigaAuswahlGuard,
  SportjahrOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard
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
  {path: 'benutzer/:id', component: BenutzerDetailComponent, canActivate: [BenutzerDetailGuard]}
  ,
  {
    path: 'dsbmannschaft',
    component: DsbMannschaftOverviewComponent,
    pathMatch: 'full',
    canActivate: [DsbMannschaftOverviewGuard]
  },
  {path: 'dsbmannschaft/:id', component: DsbMannschaftDetailComponent, canActivate: [DsbMannschaftDetailGuard]},
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
    path: 'sportjahr',
    pathMatch: 'full',
    component: SportjahrLigaAuswahlComponent,
    canActivate: [SportjahrLigaAuswahlGuard]
  },
  {
    path: 'sportjahr/liga',
    pathMatch: 'full',
    component: LigaOverviewComponent,
    canActivate: [LigaOverviewGuard]
  },
  {
    path: 'sportjahr/liga/:id',
    pathMatch: 'full',
    component: SportjahrOverviewComponent,
    canActivate: [SportjahrOverviewGuard]
  }
];
