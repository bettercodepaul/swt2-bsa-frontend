import { Routes } from '@angular/router';
import {WettkaempfeComponent} from './components/wettkaempfe/wettkaempfe.component';


export const WETTKAMPF_ROUTES: Routes = [
  { path: '', redirectTo: 'wettkaempfe', pathMatch: 'full' },
  { path: 'wettkaempfe', component: WettkaempfeComponent}
];
