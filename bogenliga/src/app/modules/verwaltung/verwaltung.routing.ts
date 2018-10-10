import {Routes} from '@angular/router';
import {VerwaltungComponent} from './components/verwaltung/verwaltung.component';
import {VerwaltungGuard} from './guards/verwaltung.guard';


export const VERWALTUNG_ROUTES: Routes = [
  {path: '', redirectTo: 'verwaltung', pathMatch: 'full', canActivate: [VerwaltungGuard]},
  {path: 'verwaltung', component: VerwaltungComponent, canActivate: [VerwaltungGuard]}
];
