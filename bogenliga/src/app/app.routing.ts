import {Routes} from '@angular/router';

import {HomeComponent} from '@home/components/home/home.component';

export const ROUTES: Routes = [
  {path: '', redirectTo: 'home', pathMatch: 'full'},
  {path: 'home', component: HomeComponent},
  {path: 'wettkaempfe', loadChildren: 'src/app/modules/wettkampf/wettkampf.module#WettkampfModule'},
  {path: 'wettkaempfe/:id', loadChildren: 'src/app/modules/wettkampf/wettkampf.module#WettkampfModule'},
  {path: 'verwaltung', loadChildren: 'src/app/modules/verwaltung/verwaltung.module#VerwaltungModule'},
  {
    path: 'sportjahresplan',
    loadChildren: 'src/app/modules/sportjahresplan/sportjahresplan.module#SportjahresplanModule'
  },
  {path: 'user', loadChildren: 'src/app/modules/user/user.module#UserModule'},
  {path: 'regionen', loadChildren: 'src/app/modules/regionen/regionen.module#RegionenModule'},
  {path: 'vereine', loadChildren: 'src/app/modules/vereine/vereine.module#VereineModule'},
  {path: 'vereine/:id', loadChildren: 'src/app/modules/vereine/vereine.module#VereineModule'},
  {path: 'playground', loadChildren: 'src/app/modules/playground/playground.module#PlaygroundModule'},
  {path: 'ligatabelle', loadChildren: 'src/app/modules/ligatabelle/ligatabelle.module#LigatabelleModule'},
  {path: 'spotter', loadChildren: 'src/app/modules/spotter/spotter.module#SpotterModule'},
];
