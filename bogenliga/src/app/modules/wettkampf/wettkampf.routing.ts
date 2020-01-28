import {Routes} from '@angular/router';
import {WettkampfComponent} from './/components/wettkampf/wettkampf.component';
import {LigaDetailComponent} from '@verwaltung/components';
import {LigaDetailGuard} from '@verwaltung/guards';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';

export const WETTKAMPF_ROUTES: Routes = [
  {path: '' , pathMatch: 'full', component: WettkampfComponent},
  {path: '/:id' , pathMatch: 'full', component: WettkampfComponent},
];
