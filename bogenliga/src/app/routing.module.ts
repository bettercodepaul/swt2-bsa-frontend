import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { OverviewComponent } from './modules/settings/components/overview/overview.component';
import {TranslatePipe} from '@ngx-translate/core';
import {DetailsComponent} from './modules/settings/components/details/details.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'settings', component: OverviewComponent},
  { path: 'details', component: DetailsComponent}
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  providers: [],
  exports: [ RouterModule ]
})
export class RoutingModule { }
