import {Routes} from '@angular/router';

import {HomeComponent} from '@home/components/home/home.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'wettkaempfe', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'wettkaempfe/:id/:id', loadChildren: () => import('src/app/modules/wettkampf/wettkampf.module').then((m) => m.WettkampfModule)},
  {path: 'verwaltung', loadChildren: () => import('src/app/modules/verwaltung/verwaltung.module').then((m) => m.VerwaltungModule)},
  {
    path: 'sportjahresplan',
    loadChildren: () => import('src/app/modules/sportjahresplan/sportjahresplan.module').then((m) => m.SportjahresplanModule)
  },
  {path: 'user', loadChildren: () => import('src/app/modules/user/user.module').then((m) => m.UserModule)},
  {path: 'regionen', loadChildren: () => import('src/app/modules/regionen/regionen.module').then((m) => m.RegionenModule)},
  {path: 'vereine', loadChildren: () => import('src/app/modules/vereine/vereine.module').then((m) => m.VereineModule)},
  {path: 'vereine/:id', loadChildren: () => import('src/app/modules/vereine/vereine.module').then((m) => m.VereineModule)},
  {path: 'playground', loadChildren: () => import('src/app/modules/playground/playground.module').then((m) => m.PlaygroundModule)},
  {path: 'ligatabelle', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'ligatabelle/:id', loadChildren: () => import('src/app/modules/ligatabelle/ligatabelle.module').then((m) => m.LigatabelleModule)},
  {path: 'spotter', loadChildren: () => import('src/app/modules/spotter/spotter.module').then((m) => m.SpotterModule)},
];
