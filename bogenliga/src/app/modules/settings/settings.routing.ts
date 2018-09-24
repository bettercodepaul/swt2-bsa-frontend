import { Routes } from '@angular/router';
import {DetailsComponent} from './components/details/details.component';
import {OverviewComponent} from './components/overview/overview.component';


export const SETTINGS_ROUTES: Routes = [
  { path: '', redirectTo: '/overview', pathMatch: 'full' },
  { path: 'overview', component: OverviewComponent},
  { path: 'details', component: DetailsComponent},
  { path: 'details/:key', component: DetailsComponent}
];
