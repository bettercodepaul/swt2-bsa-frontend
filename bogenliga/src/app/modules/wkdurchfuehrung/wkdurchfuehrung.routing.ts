import {Routes} from '@angular/router';


import {WkdurchfuehrungComponent} from './components/wkdurchfuehrung/wkdurchfuehrung.component';
import {SchusszettelComponent} from './components/schusszettel/schusszettel.component';
import {TabletEingabeComponent} from './components/tableteingabe/tableteingabe.component';
import {TabletAdminComponent} from './components/tablet-admin/tablet-admin.component';
import {WkdurchfuehrungGuard} from './guards/wkdurchfuehrung.guard';
import {FullscreenComponent} from '@wkdurchfuehrung/components';
import {AnzeigeManagerComponent} from '@wkdurchfuehrung/components';
import {AnzeigePhysischeIDComponent} from '@wkdurchfuehrung/components';
import {TabletAdminPopUpComponent} from './components/tablet-admin/tablet-admin-pop-up/tablet-admin-pop-up.component';
import {SchusszettelGuard, TabletadminGuard, TableteingabeGuard} from '@wkdurchfuehrung/guards';
import {TabelleErgebnisLetzteMatchComponent} from './components/tabelle-ergebnis-letzte_match/tabelle-ergebnis-letzte-match.component';


export const wkdurchfuehrung_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: WkdurchfuehrungComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: '', pathMatch: 'full', component: SchusszettelComponent, canActivate: [SchusszettelGuard]},
  {path: '', pathMatch: 'full', component: TabletEingabeComponent, canActivate: [TableteingabeGuard]},
  {path: '', pathMatch: 'full', component: TabletAdminComponent, canActivate: [TabletadminGuard]},
  {path: '', pathMatch: 'full', component: TabletAdminPopUpComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'anzeige-manager/:selectedWettkampfId/:veranstaltungId/:wettkampftag', pathMatch: 'full', component: AnzeigeManagerComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'anzeige-manager/:selectedWettkampfId', pathMatch: 'full', component: AnzeigeManagerComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'bildschirm-registrierung/:wettkampfId/:veranstaltungId/:wettkampftag', pathMatch: 'full', component: AnzeigePhysischeIDComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'bildschirm-registrierung', pathMatch: 'full', component: AnzeigePhysischeIDComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'fullscreen', pathMatch: 'full', component: FullscreenComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'letzte-match-fullscreen', pathMatch: 'full', component: TabelleErgebnisLetzteMatchComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: ':veranstaltungId/:wettkampfId', pathMatch: 'full', component: WkdurchfuehrungComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'tabletadmin/:wettkampfId', pathMatch: 'full', component: TabletAdminComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'schusszettel/:match1id/:match2id', pathMatch: 'full', component: SchusszettelComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: ':match1id/:match2id/tablet', pathMatch: 'full', component: TabletEingabeComponent, canActivate: [WkdurchfuehrungGuard]},
  {path: 'fullscreen/:veranstaltungId/:wettkampftag', pathMatch: 'full', component: FullscreenComponent, canActivate: [WkdurchfuehrungGuard]},
];
