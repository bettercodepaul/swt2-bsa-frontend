import {Routes} from '@angular/router';


import {WkdurchfuehrungComponent} from './components/wkdurchfuehrung/wkdurchfuehrung.component';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';
import {WkdurchfuehrungGuard} from './guards/wkdurchfuehrung.guard';
import {FullscreenComponent} from '@wkdurchfuehrung/components';
import {TabletAdminPopUpComponent} from './components/tablet-admin/tablet-admin-pop-up/tablet-admin-pop-up.component';
import {SchusszettelTabletAdminComponent} from '@schusszettel/components/setup/schusszettel-tablet-admin.component';



export const wkdurchfuehrung_ROUTES: Routes = [
  { path: '', pathMatch: 'full', component: WkdurchfuehrungComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'schusszettel', pathMatch: 'full', component: SchusszettelComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'tablet', pathMatch: 'full', component: TabletEingabeComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'tabletadmin', pathMatch: 'full', component: TabletAdminComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'tabletadmin/popup', pathMatch: 'full', component: TabletAdminPopUpComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'fullscreen', pathMatch: 'full', component: FullscreenComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: ':veranstaltungId/:wettkampfId', pathMatch: 'full', component: WkdurchfuehrungComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'tabletadmin/:wettkampfId', pathMatch: 'full', component: TabletAdminComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'schusszettel/:match1id/:match2id', pathMatch: 'full', component: SchusszettelComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: ':match1id/:match2id/tablet', pathMatch: 'full', component: TabletEingabeComponent, canActivate: [WkdurchfuehrungGuard] },
  { path: 'fullscreen/:veranstaltungId/:wettkampftag', pathMatch: 'full', component: FullscreenComponent, canActivate: [WkdurchfuehrungGuard] }
];

