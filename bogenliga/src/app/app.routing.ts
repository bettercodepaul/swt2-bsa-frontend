import {Routes} from '@angular/router';

import {HomeComponent} from '@home/components/home/home.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'home/:id', component: HomeComponent},
  {path: 'wettkaempfe', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'verwaltung', loadChildren: () => import('src/app/modules/verwaltung/verwaltung.module').then((m) => m.VerwaltungModule)},
  {path: 'wkdurchfuehrung', loadChildren: () => import('src/app/modules/wkdurchfuehrung/wkdurchfuehrung.module').then((m) => m.WkdurchfuehrungModule)},
  {path: 'wkdurchfuehrung/:id', loadChildren: () => import('src/app/modules/wkdurchfuehrung/wkdurchfuehrung.module').then((m) => m.WkdurchfuehrungModule)},
  {path: 'user', loadChildren: () => import('src/app/modules/user/user.module').then((m) => m.UserModule)},
  {path: 'vereine/:id/:mannschaftId', loadChildren: () => import('src/app/modules/mannschaft/mannschaft.module').then((m) => m.MannschaftModule)},
  {path: 'vereine', loadChildren: () => import('src/app/modules/vereinsmannschaftenuebersicht/vereinsmannschaftenuebersicht.module').then((m) => m.VereinsmannschaftenuebersichtModule)},
  {path: 'vereine/:id', loadChildren: () => import('src/app/modules/vereinsmannschaftenuebersicht/vereinsmannschaftenuebersicht.module').then((m) => m.VereinsmannschaftenuebersichtModule)},
  {path: 'playground', loadChildren: () => import('src/app/modules/playground/playground.module').then((m) => m.PlaygroundModule)},
  {path: 'ligatabelle', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'ligatabelle/:id', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'liga', loadChildren: () => import('src/app/modules/liga-overview/liga-overview.module').then((m) => m.LigaOverviewModule)},
  {path: 'spotter', loadChildren: () => import('src/app/modules/spotter/spotter.module').then((m) => m.SpotterModule)},
  {path: 'schusszettel', loadChildren: () => import('./modules/schusszettel/schusszettel.module').then((m) => m.SchusszettelModule)},
  {path: 'hilfe', loadChildren: () => import('src/app/modules/hilfe/hilfe.module').then((m) => m.HilfeModule)},
  {path: 'wkdurchfuehrung/tabletadmin/:id/:id/:id', loadChildren: () => import('src/app/modules/spotter/spotter.module').then((m) => m.SpotterModule)},
];
