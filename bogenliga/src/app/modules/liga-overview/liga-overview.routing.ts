import {Routes} from '@angular/router';
import {LigaOverviewComponent} from './components/liga-overview/liga-overview.component';

/**
 * Routen-Konfiguration für das Liga-Overview Modul
 *
 * Definiert alle verfügbaren Routen für die Ligaübersicht.
 */

export const LIGA_OVERVIEW_ROUTES: Routes = [
  {
    path: '',
    component: LigaOverviewComponent
  }
];
