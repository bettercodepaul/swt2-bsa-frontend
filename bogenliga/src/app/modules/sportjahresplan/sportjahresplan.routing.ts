import {Routes} from '@angular/router';


import {SportjahresplanComponent} from './components/sportjahresplan/sportjahresplan.component';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';
import {SportjahresplanGuard} from './guards/sportjahresplan.guard';


export const SPORTJAHRESPLAN_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: SportjahresplanComponent, canActivate: [SportjahresplanGuard]},
  {path: '', pathMatch: 'full', component: SchusszettelComponent},
  {path: '', pathMatch: 'full', component: TabletEingabeComponent},
  {path: '', pathMatch: 'full', component: TabletAdminComponent},
  {path: 'tabletadmin/:wettkampfId', pathMatch: 'full', component: TabletAdminComponent},
  {path: 'schusszettel/:match1id/:match2id', pathMatch: 'full', component: SchusszettelComponent},
  {path: ':match1id/:match2id/tablet', pathMatch: 'full', component: TabletEingabeComponent},
];
