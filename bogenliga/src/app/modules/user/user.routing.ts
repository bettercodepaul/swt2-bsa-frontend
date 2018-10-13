import {Routes} from '@angular/router';
import {UserGuard} from './guards/user.guard';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserComponent} from './components/user/user.component';
import {LoginComponent} from './components/login/login.component';


export const USER_ROUTES: Routes = [
  {path: '', redirectTo: 'user', pathMatch: 'full', canActivate: [UserGuard]},
  {path: 'login', component: LoginComponent, canActivate: [UserGuard]},
  {path: 'profile', component: UserProfileComponent, canActivate: [UserGuard]},
  {path: 'user', component: UserComponent, canActivate: [UserGuard]},
];
