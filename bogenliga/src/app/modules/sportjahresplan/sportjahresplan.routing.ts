import {Routes} from '@angular/router';
import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';
import {SportjahresplanGuard} from './guards/sportjahresplan.guard';


export const SPORTJAHRESPLAN_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SportjahresplanComponent, canActivate: [SportjahresplanGuard]},
];
