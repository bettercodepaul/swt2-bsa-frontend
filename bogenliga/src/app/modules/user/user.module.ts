import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserProfileComponent} from './components/user-profile/user-profile.component';
import {UserGuard} from './guards/user.guard';
import {UserComponent} from './components/user/user.component';
import {RouterModule} from '@angular/router';
import {SharedModule} from '../shared/shared.module';
import {FormsModule} from '@angular/forms';
import {USER_ROUTES} from './user.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(USER_ROUTES),
    SharedModule,
    FormsModule
  ],
  declarations: [UserProfileComponent, UserComponent],
  providers: [UserGuard]
})
export class UserModule {
}
