import {Routes} from '@angular/router';
import {VereineComponent} from './components';


export const VEREINE_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: VereineComponent},
  {path: ':id', component: VereineComponent},
  // TODO Constantin fragen warum nicht geht
  /*{
    path: ':id/:mannschaftID',
    loadChildren: () =>
      import('../mannschaft/mannschaft.module')
        .then((m) => m.MannschaftModule)
  }*/
];
