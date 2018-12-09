import {Routes} from '@angular/router';

import {VereineComponent}from './components/vereine/vereine.component';
import {VereineMannschaftenComponent} from './components/mannschaften/vereine-mannschaften.component';



export const VEREINE_ROUTES: Routes = [
  {path: '', component: VereineComponent},
  {path: ':id', component: VereineMannschaftenComponent}
];
