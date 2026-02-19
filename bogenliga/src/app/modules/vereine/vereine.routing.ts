import {Routes} from '@angular/router';
import {MannschaftComponent, VereinComponent, VereineComponent} from './components';
import {LigaResolver} from "@shared/routing/resolvers/liga.resolver";


export const VEREINE_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: VereineComponent},
  {path: ':id/:mannschaftId', component: MannschaftComponent,resolve: {liga: LigaResolver}},
  {path: ':id', pathMatch: 'full', component: VereinComponent},
];
