import {Routes} from '@angular/router';
import {LigatabelleComponent} from './components/ligatabelle/ligatabelle.component';
import {LigatabelleGuard} from './guards/ligatabelle.guard';


export const LIGATABELLE_ROUTES: Routes = [
  {path: '', component: LigatabelleComponent, canActivate: [LigatabelleGuard], pathMatch: 'full'},
  {path: '/:id', component: LigatabelleComponent, canActivate: [LigatabelleGuard], pathMatch: 'full'}
];
