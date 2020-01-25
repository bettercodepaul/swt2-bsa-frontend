import {Routes} from '@angular/router';
import {WettkampfComponent} from './/components/wettkampf/wettkampf.component';
import {DsbMitgliedDetailComponent} from '@verwaltung/components';
import {DsbMitgliedDetailGuard} from '@verwaltung/guards';

export const WETTKAMPF_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: WettkampfComponent},
];
