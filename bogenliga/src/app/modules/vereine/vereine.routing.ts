import {Routes} from '@angular/router';

import {VereineMannschaftenComponent} from './components/mannschaften/vereine-mannschaften.component';
import {VereineComponent} from './components/vereine/vereine.component';

export const VEREINE_ROUTES: Routes = [
  {path: '', component: VereineComponent},
  {path: ':id', component: VereineMannschaftenComponent},
  {path: ':id/:mannschaft', component: VereineMannschaftenComponent}
];
