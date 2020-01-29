import {Routes} from '@angular/router';
import {WettkampfComponent} from './/components/wettkampf/wettkampf.component';

export const WETTKAMPF_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: WettkampfComponent},
];
