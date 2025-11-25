import {Routes} from '@angular/router';
import {WettkampfComponent} from '@wettkampf/components';
import {LigaDetailComponent} from '@verwaltung/components';
import {LigaDetailGuard} from '@verwaltung/guards';
import {WettkampfErgebnisService} from '@wettkampf/services/wettkampf-ergebnis.service';
import {LigatabelleGuard} from "../ligatabelle/guards/ligatabelle.guard";
import {LigaStickyGuard} from "@shared/routing/guards/liga-sticky.guard";
import {LigaResolver} from "@shared/routing/resolvers/liga.resolver";

export const WETTKAMPF_ROUTES: Routes = [
  {path: '' ,
    resolve: { liga: LigaResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    pathMatch: 'full',
    component: WettkampfComponent},
  {path: ':Wettkampf' , pathMatch: 'full', component: WettkampfComponent},
  {path: ':Wettkampf/:Mannschaft' , pathMatch: 'full', component: WettkampfComponent},
];
