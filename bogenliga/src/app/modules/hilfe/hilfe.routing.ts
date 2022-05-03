import {Routes} from '@angular/router';
import {HilfeComponent} from './components/hilfe/hilfe.component';


export const HILFE_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: HilfeComponent},
];
