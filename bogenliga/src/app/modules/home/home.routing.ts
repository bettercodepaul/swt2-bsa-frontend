import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {ImpressumComponent} from './components/impressum/impressum.component';
import {HomeGuard} from './guards/home.guard';


export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'home/:id', component: HomeComponent, canActivate: [HomeGuard]},
  {path: 'impressum', component: ImpressumComponent, canActivate: [HomeGuard]},
  //{path: '**', component: HomeComponent, canActivate: [HomeGuard]}
];
