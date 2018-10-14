import {Routes} from '@angular/router';
import {UserGuard} from './guards/user.guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {LoginComponent} from './components/login/login.component';


export const USER_ROUTES: Routes = [
  {path: '', redirectTo: 'profile', pathMatch: 'full'},
  {path: 'login', component: LoginComponent, canActivate: [UserGuard]},
  {path: 'profile', component: UserProfileComponent, canActivate: [UserGuard]},
];
