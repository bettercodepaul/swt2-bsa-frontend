import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {SharedModule} from '../shared/shared.module';
import {RouterModule} from '@angular/router';
import {LOGIN_ROUTES} from './login.routing';
import {LoginComponent} from './components/login/login.component';
import {FormsModule} from '@angular/forms';
import {LocalDataProviderModule} from '../shared/local-data-provider/local-data-provider.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LOGIN_ROUTES),
    SharedModule,
    FormsModule,
    LocalDataProviderModule
  ],
  declarations: [LoginComponent]
})
export class LoginModule {}
