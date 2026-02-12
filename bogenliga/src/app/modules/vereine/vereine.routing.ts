import {Routes} from '@angular/router';
import {MannschaftComponent, VereinComponent, VereineComponent} from './components';


export const VEREINE_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: VereineComponent},
  {path: ':id/:mannschaftId', component: MannschaftComponent},
  {path: ':id', pathMatch: 'full', component: VereinComponent},
];
