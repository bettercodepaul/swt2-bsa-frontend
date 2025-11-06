import {Routes} from '@angular/router';

import {HomeComponent} from '@home/components/home/home.component';
import {SchusszettelTabletAdminComponent} from '@schusszettel/components/setup/schusszettel-tablet-admin.component';
import {CurrentLigaGuard} from "@verwaltung/guards/current-liga.guard";
import {LigaContextResolver} from "@shared/resolvers/liga-context.resolver";

export const ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {
    path: 'home/:id',
    canActivate: [CurrentLigaGuard],
    resolve: { ligaContext: LigaContextResolver },
    component: HomeComponent,
  },
  // Liga-Home via Deeplink: nutzt Guard (setzt CurrentLiga) + Resolver (baut Basis-Kontext)
  {
    path: 'home/:ligaId',
    canActivate: [CurrentLigaGuard],
    resolve: { ligaContext: LigaContextResolver },
    component: HomeComponent,
  },
  // Optional: kompatibler Alias (falls ihr später auf /liga/:ligaId wechseln wollt)
  // { path: 'liga/:ligaId', redirectTo: 'home/:ligaId', pathMatch: 'full' },
  {path: 'wettkaempfe', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'verwaltung', loadChildren: () => import('src/app/modules/verwaltung/verwaltung.module').then((m) => m.VerwaltungModule)},
  {path: 'wkdurchfuehrung', loadChildren: () => import('src/app/modules/wkdurchfuehrung/wkdurchfuehrung.module').then((m) => m.WkdurchfuehrungModule)},
  {path: 'wkdurchfuehrung/:id', loadChildren: () => import('src/app/modules/wkdurchfuehrung/wkdurchfuehrung.module').then((m) => m.WkdurchfuehrungModule)},
  {path: 'user', loadChildren: () => import('src/app/modules/user/user.module').then((m) => m.UserModule)},
  {path: 'regionen', loadChildren: () => import('src/app/modules/regionen/regionen.module').then((m) => m.RegionenModule)},
  {path: 'vereine', loadChildren: () => import('src/app/modules/vereine/vereine.module').then((m) => m.VereineModule)},
  {path: 'vereine/:id', loadChildren: () => import('src/app/modules/vereine/vereine.module').then((m) => m.VereineModule)},
  {path: 'playground', loadChildren: () => import('src/app/modules/playground/playground.module').then((m) => m.PlaygroundModule)},
  {path: 'ligatabelle', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'ligatabelle/:id', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'spotter', loadChildren: () => import('src/app/modules/spotter/spotter.module').then((m) => m.SpotterModule)},
  {path: 'schusszettel', loadChildren: () => import('./modules/schusszettel/schusszettel.module').then((m) => m.SchusszettelModule)},
  {path: 'hilfe', loadChildren: () => import('src/app/modules/hilfe/hilfe.module').then((m) => m.HilfeModule)},
  {path: 'wkdurchfuehrung/tabletadmin/:id/:id/:id', loadChildren: () => import('src/app/modules/spotter/spotter.module').then((m) => m.SpotterModule)},
];
