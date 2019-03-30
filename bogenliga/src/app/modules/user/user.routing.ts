import {Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserPwdComponent} from './components/user-pwd/user-pwd.component';
import {UserGuard} from './guards/user.guard';


export const USER_ROUTES: Routes = [
  {path: 'profile', pathMatch: 'full', component: UserProfileComponent, canActivate: [UserGuard]},
  {path: 'pwd', pathMatch: 'full', component: UserPwdComponent, canActivate: [UserGuard]},
  {path: 'login', component: LoginComponent, canActivate: [UserGuard]},
];
