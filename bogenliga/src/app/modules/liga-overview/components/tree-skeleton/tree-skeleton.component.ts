import { Component, ChangeDetectionStrategy } from '@angular/core';

/**
 * Skeleton-Loader für die Tree-Komponente.
 * Zeigt animierte Platzhalter während des Ladens der Liga-Hierarchie.
 */
@Component({
    selector: 'bla-tree-skeleton',
    templateUrl: './tree-skeleton.component.html',
    styleUrls: ['./tree-skeleton.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TreeSkeletonComponent { }
