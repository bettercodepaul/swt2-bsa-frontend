import { Routes } from '@angular/router';
import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';


export const SPORTJAHRESPLAN_ROUTES: Routes = [
  { path: '', redirectTo: 'sportjahresplan', pathMatch: 'full' },
  { path: 'sportjahresplan', component: SportjahresplanComponent}
];
