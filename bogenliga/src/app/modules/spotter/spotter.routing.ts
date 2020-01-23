
import {Routes} from '@angular/router';

import { InterfaceComponent } from './components/interface/interface.component';
import { InterfaceGuard } from './guards/interface.guard';




export const SPOTTER_ROUTES: Routes = [
  {path: '', component: InterfaceComponent, canActivate: [InterfaceGuard]},
];
