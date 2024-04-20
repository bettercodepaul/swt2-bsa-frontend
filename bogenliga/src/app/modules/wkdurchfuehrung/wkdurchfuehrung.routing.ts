import {Routes} from '@angular/router';


import {WkdurchfuehrungComponent} from './components/wkdurchfuehrung/wkdurchfuehrung.component';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';
import {WkdurchfuehrungGuard} from './guards/wkdurchfuehrung.guard';
import {FullscreenComponent} from './components/fullscreen/fullscreen.component';


export const wkdurchfuehrung_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: WkdurchfuehrungComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: '', pathMatch: 'full', component: SchusszettelComponent},
  {path: '', pathMatch: 'full', component: TabletEingabeComponent},
  {path: '', pathMatch: 'full', component: TabletAdminComponent},
  {path: 'fullscreen', pathMatch: 'full', component: FullscreenComponent},
  {path: ':wettkampfId', pathMatch: 'full', component: WkdurchfuehrungComponent},
  {path: 'tabletadmin/:wettkampfId', pathMatch: 'full', component: TabletAdminComponent},
  {path: 'schusszettel/:match1id/:match2id', pathMatch: 'full', component: SchusszettelComponent},
  {path: ':match1id/:match2id/tablet', pathMatch: 'full', component: TabletEingabeComponent},
];
