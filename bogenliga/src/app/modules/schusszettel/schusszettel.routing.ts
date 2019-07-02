import {Routes} from '@angular/router';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';


export const SCHUSSZETTEL_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SchusszettelComponent},
  {path: 'tablet', pathMatch: 'full', component: TabletEingabeComponent},
];
