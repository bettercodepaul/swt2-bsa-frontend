import {Routes} from '@angular/router';
import {MannschaftComponent} from '../mannschaft/components/mannschaft/mannschaft.component';
import {LigatabelleComponent} from '../mannschaft/components/ligatabelle/ligatabelle.component';

export const MANNSCHAFT_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: MannschaftComponent},
  {path: '', pathMatch: 'full', component: LigatabelleComponent},
];
