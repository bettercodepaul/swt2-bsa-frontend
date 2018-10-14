import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserGuard} from './guards/user.guard';
import {RouterModule} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {USER_ROUTES} from './user.routing';
import {LoginComponent} from './components/login/login.component';
import {SharedModule} from '../shared';

@NgModule({
  imports:      [
    CommonModule,
    RouterModule.forChild(USER_ROUTES),
    SharedModule.forChild(),
    FormsModule
  ],
  declarations: [LoginComponent, UserProfileComponent],
  providers:    [UserGuard]
})
export class UserModule {
}
