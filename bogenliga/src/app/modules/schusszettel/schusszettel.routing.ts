import {Routes} from '@angular/router';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';


export const SCHUSSZETTEL_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SchusszettelComponent},
];
