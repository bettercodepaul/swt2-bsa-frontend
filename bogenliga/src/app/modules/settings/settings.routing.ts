import {Routes} from '@angular/router';
import {DetailsComponent} from './components/details/details.component';
import {OverviewComponent} from './components/overview/overview.component';
import {SettingsGuard} from './guards/settings.guard';


export const SETTINGS_ROUTES: Routes = [
  {path: '', redirectTo: 'overview', pathMatch: 'full', canActivate: [SettingsGuard]},
  {path: 'overview', component: OverviewComponent, canActivate: [SettingsGuard]},
  {path: 'details', component: DetailsComponent, canActivate: [SettingsGuard]},
  {path: 'details/:key', component: DetailsComponent, canActivate: [SettingsGuard]}
];
