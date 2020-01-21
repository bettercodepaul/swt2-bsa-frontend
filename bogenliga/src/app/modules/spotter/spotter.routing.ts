
import {Routes} from '@angular/router';

import {LoginComponent} from './components/login/login.component';
import {LoginGuard} from './guards/login.guard';

import { InterfaceComponent } from './components/interface/interface.component';
import { InterfaceGuard } from './guards/interface.guard';




export const SPOTTER_ROUTES: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'login'},
  {path: 'login', component: LoginComponent, canActivate: [LoginGuard]},
  {path: 'interface', component: InterfaceComponent, canActivate: [InterfaceGuard]}
];
