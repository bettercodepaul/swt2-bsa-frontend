import {Routes} from '@angular/router';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkampfGuard} from './guards/wettkampf.guard';


export const WETTKAMPF_ROUTES: Routes = [
  {path: '', redirectTo: 'wettkaempfe', pathMatch: 'full', canActivate: [WettkampfGuard]},
  {path: 'wettkaempfe', component: WettkaempfeComponent, canActivate: [WettkampfGuard]}
];
