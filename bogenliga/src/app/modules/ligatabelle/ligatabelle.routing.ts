import { Routes } from '@angular/router';
import { LigatabelleComponent } from './components/ligatabelle/ligatabelle.component';
import { LigatabelleGuard } from './guards/ligatabelle.guard';

// Neu: Liga-Kontext wie auf der Home-Seite
import { LigaResolver } from '@shared/routing/resolvers/liga.resolver';
import { LigaStickyGuard } from '@shared/routing/guards/liga-sticky.guard';

export const LIGATABELLE_ROUTES: Routes = [
  {
    path: '',
    component: LigatabelleComponent,
    canActivate: [LigatabelleGuard, LigaStickyGuard],
    resolve: { liga: LigaResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    pathMatch: 'full'
  },
  {
    path: ':id',
    component: LigatabelleComponent,
    canActivate: [LigatabelleGuard, LigaStickyGuard],
    resolve: { liga: LigaResolver },
    runGuardsAndResolvers: 'paramsOrQueryParamsChange',
    pathMatch: 'full'
  }
];
