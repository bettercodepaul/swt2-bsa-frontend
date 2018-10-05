import { Routes } from '@angular/router';
import {VerwaltungComponent} from './components/verwaltung/verwaltung.component';


export const VERWALTUNG_ROUTES: Routes = [
  { path: '', redirectTo: 'verwaltung', pathMatch: 'full' },
  { path: 'verwaltung', component: VerwaltungComponent}
];
