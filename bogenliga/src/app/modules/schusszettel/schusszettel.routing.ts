import {Routes} from '@angular/router';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';


export const SCHUSSZETTEL_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SchusszettelComponent},
  {path: 'tablet', pathMatch: 'full', component: TabletEingabeComponent},
  {path: 'tabletadmin/:wettkampfId', pathMatch: 'full', component: TabletAdminComponent},
];
