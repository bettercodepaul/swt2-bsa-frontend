import {Routes} from '@angular/router';

import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkaempfeGuard} from './guards/wettkaempfe.guard';

import { MatchesComponent } from './components/matches/matches.component';
import { MatchesGuard } from './guards/matches.guard';

import { BahnenComponent } from './components/bahnen/bahnen.component';
import { BahnenGuard } from './guards/bahnen.guard';

import { SchuetzenComponent } from './components/schuetzen/schuetzen.component';
import { SchuetzenGuard } from './guards/schuetzen.guard';

export const SPOTTER_ROUTES: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'wettkaempfe'},
  {path: 'wettkaempfe', component: WettkaempfeComponent, canActivate: [WettkaempfeGuard]},
  {path: 'matches', component: MatchesComponent, canActivate: [MatchesGuard]},
  {path: 'bahnen', component: BahnenComponent, canActivate: [BahnenGuard]},
  {path: 'schuetzen', component: SchuetzenComponent, canActivate: [SchuetzenGuard]}
];
