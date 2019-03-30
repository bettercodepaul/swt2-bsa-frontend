import {CommonModule} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared';
import {LoginComponent} from './components/login/login.component';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserPwdComponent} from './components/user-pwd/user-pwd.component';
import {UserGuard} from './guards/user.guard';
import {USER_ROUTES} from './user.routing';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(USER_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  declarations: [LoginComponent, UserProfileComponent, UserPwdComponent],
  providers:    [UserGuard]
})
export class UserModule {
}
