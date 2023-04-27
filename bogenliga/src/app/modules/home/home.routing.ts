import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';

import {VereinDetailComponent} from '@verwaltung/components';



export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
];

export const BUTTON_ROUTES: Routes = [
  {path: 'Vereindetails', component: VereinDetailComponent}
]
