import {Routes} from '@angular/router';
import {VereinsmannschaftenuebersichtComponent} from "./components";

export const MANNSCHAFTSUEBERSICHT_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: VereinsmannschaftenuebersichtComponent}
];

