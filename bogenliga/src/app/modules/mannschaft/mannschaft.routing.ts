import {Routes} from '@angular/router';
import {MannschaftComponent} from '../mannschaft/components/mannschaft/mannschaft.component';

export const MANNSCHAFT_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: MannschaftComponent},
];
