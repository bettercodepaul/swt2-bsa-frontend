import {Routes} from '@angular/router';
import {HomeComponent} from './components/home/home.component';
import {HomeGuard} from './guards/home.guard';


export const HOME_ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full', canActivate: [HomeGuard]},
  {path: 'home', component: HomeComponent, canActivate: [HomeGuard]},
];
