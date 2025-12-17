import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared';
import { LigaOverviewComponent } from './components/liga-overview/liga-overview.component';
import { LIGA_OVERVIEW_ROUTES } from './liga-overview.routing';
import { TreeComponent } from './components/tree/tree.component';
import { TreeNodeComponent } from './components/tree/tree-node.component';
import { TreeSkeletonComponent } from './components/tree-skeleton/tree-skeleton.component';
import { ErrorStateComponent } from './components/error-state/error-state.component';
import { EmptyStateComponent } from './components/empty-state/empty-state.component';

/**
 * Modul für die Ligaübersicht
 *
 * Enthält alle Komponenten, Services und Routen für die Ligaübersicht-Funktionalität.
 */

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(LIGA_OVERVIEW_ROUTES),
    SharedModule
  ],
  declarations: [
    LigaOverviewComponent,
    TreeComponent,
    TreeNodeComponent,
    TreeSkeletonComponent,
    ErrorStateComponent,
    EmptyStateComponent
  ]
})
export class LigaOverviewModule {
}
