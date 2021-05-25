import {Routes} from '@angular/router';

import {
  UserDetailComponent,
  UserNeuComponent,
  UserOverviewComponent,
  DsbMitgliedDetailComponent,
  DsbMitgliedOverviewComponent,
  LigaDetailComponent,
  LigaOverviewComponent,
  RegionDetailComponent,
  RegionOverviewComponent,
  VereinDetailComponent,
  VereinOverviewComponent,
  VerwaltungComponent,
  WettkampfklasseDetailComponent,
  WettkampfklasseOverviewComponent,
  VeranstaltungDetailComponent,
  VeranstaltungOverviewComponent,
  WettkampftageComponent,
  SportjahrOverviewComponent,
  EinstellungenDetailComponent,
  EinstellungenOverviewComponent
} from './components';
import {
  UserDetailGuard,
  UserNeuGuard,
  UserOverviewGuard,
  DsbMitgliedDetailGuard,
  DsbMitgliedOverviewGuard,
  LigaDetailGuard,
  LigaOverviewGuard,
  RegionDetailGuard,
  RegionOverviewGuard,
  VereinDetailGuard,
  VereinOverviewGuard,
  VerwaltungGuard,
  WettkampfklasseDetailGuard,
  WettkampfklasseOverviewGuard,
  VeranstaltungDetailGuard,
  VeranstaltungOverviewGuard,
  WettkampftageGuard,
  SportjahrOverviewGuard,
  EinstellungenDetailGuard,
  EinstellungenOverviewGuard
} from './guards';
import {MannschaftDetailComponent} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/mannschaft-detail.component';
import {DsbMannschaftDetailGuard} from '@verwaltung/guards/dsb-mannschaft-detail.guard';
import {SchuetzenComponent} from '@verwaltung/components/verein/verein-detail/mannschafts-detail/schuetzen/schuetzen.component';
import {SchuetzenNeuGuard} from '@verwaltung/guards/schuetzen-neu.guard';

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
    path: 'user',
    component: UserOverviewComponent,
    pathMatch: 'full',
    canActivate: [UserOverviewGuard]
  },
  {path: 'user/add', component: UserNeuComponent, canActivate: [UserNeuGuard]}
  ,
  {path: 'user/:id', component: UserDetailComponent, canActivate: [UserDetailGuard]},
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
  {path: 'vereine/:id/:id', component: MannschaftDetailComponent, canActivate: [DsbMannschaftDetailGuard]},
  {path: 'vereine/:id/:id/:id', component: SchuetzenComponent, canActivate: [SchuetzenNeuGuard]},

  {
    path: 'liga',
    component: LigaOverviewComponent,
    pathMatch: 'full',
    canActivate: [LigaOverviewGuard]
  },
  {path: 'liga/:id', component: LigaDetailComponent, canActivate: [LigaDetailGuard]},
  {
    path: 'regionen',
    component: RegionOverviewComponent,
    pathMatch: 'full',
    canActivate: [RegionOverviewGuard]
  },
  {path: 'regionen/:id', component: RegionDetailComponent, canActivate: [RegionDetailGuard]},
  {
    path: 'veranstaltung',
    component: VeranstaltungOverviewComponent,
    pathMatch: 'full',
    canActivate: [VeranstaltungOverviewGuard]
  },
  {path: 'veranstaltung/:id', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]},
  {
    path:        'sportjahr',
    component:   SportjahrOverviewComponent,
    pathMatch:   'full',
    canActivate: [SportjahrOverviewGuard]
  },
  {
    path: 'einstellungen',
    component: EinstellungenOverviewComponent,
    pathMatch: 'full',
    canActivate: [EinstellungenOverviewGuard]
  },
  {path: 'einstellungen/:id', component: EinstellungenDetailComponent, canActivate: [EinstellungenDetailGuard]},
  {path: 'sportjahr/:id', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]},
  {path: 'veranstaltung/:id', component: VeranstaltungDetailComponent, canActivate: [VeranstaltungDetailGuard]},
  {path: 'veranstaltung/:id/:id', component: WettkampftageComponent, canActivate: [WettkampftageGuard]}
];
