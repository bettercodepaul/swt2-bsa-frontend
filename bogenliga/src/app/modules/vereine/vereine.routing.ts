import {Routes} from '@angular/router';
import {MannschaftComponent, VereinComponent, VereineComponent} from './components';
import {LigaResolver} from "@shared/routing/resolvers/liga.resolver";
import {LigaStickyGuard} from "@shared/routing/guards/liga-sticky.guard";


export const VEREINE_ROUTES: Routes = [
  {path: '', pathMatch: 'full', component: VereineComponent},
  // LigaStickyGuard hängt den gemerkten liga-QueryParam wieder an, bevor der LigaResolver läuft.
  // Sonst würde der Resolver den Liga-Kontext leeren, wenn man z.B. aus den Wettkampfergebnissen
  // zu einem Verein/einer Mannschaft navigiert (BSAPP-2103).
  {path: ':id/:mannschaftId', component: MannschaftComponent, canActivate: [LigaStickyGuard], resolve: {liga: LigaResolver}},
  {path: ':id', pathMatch: 'full', component: VereinComponent},
];
