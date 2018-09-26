import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import {TranslateModule, TranslatePipe} from '@ngx-translate/core';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';

export const ROUTES: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'home', component: HomeComponent },
  { path: 'wettkaempfe', component: WettkaempfeComponent },
  { path: 'settings', loadChildren: 'src/app/modules/settings/settings.module#SettingsModule' }
];
