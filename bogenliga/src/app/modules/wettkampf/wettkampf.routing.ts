import {Routes} from '@angular/router';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';
import {WettkampfGuard} from './guards/wettkampf.guard';
import {SetzlisteComponent} from './components/setzliste/setzliste.component';


export const WETTKAMPF_ROUTES: Routes = [
  {path: '', component: WettkaempfeComponent, canActivate: [WettkampfGuard]},
  {path: 'setzliste', component: SetzlisteComponent}
];
