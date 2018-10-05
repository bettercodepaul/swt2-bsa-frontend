import { Routes } from '@angular/router';
import {ImpressumComponent} from './components/impressum/impressum.component';


export const IMPRESSUM_ROUTES: Routes = [
  { path: '', redirectTo: 'impressum', pathMatch: 'full' },
  { path: 'impressum', component: ImpressumComponent}
];
