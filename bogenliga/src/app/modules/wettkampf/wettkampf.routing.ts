import {Routes} from '@angular/router';
import {WettkampfComponent} from '@wettkampf/components';
import {LigaDetailComponent} from '@verwaltung/components';
import {LigaDetailGuard} from '@verwaltung/guards';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';

export const WETTKAMPF_ROUTES: Routes = [
  {path: '' , pathMatch: 'full', component: WettkampfComponent},
  {path: ':Wettkampf' , pathMatch: 'full', component: WettkampfComponent},
  {path: ':Wettkampf/:Mannschaft' , pathMatch: 'full', component: WettkampfComponent},
];
