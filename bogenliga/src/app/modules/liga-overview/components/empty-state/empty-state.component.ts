import { Component, Input, ChangeDetectionStrategy } from '@angular/core';

/**
 * Empty-State Komponente.
 * Zeigt einen erklärenden Hinweis wenn keine Daten vorhanden sind.
 */
@Component({
    selector: 'bla-empty-state',
    templateUrl: './empty-state.component.html',
    styleUrls: ['./empty-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class EmptyStateComponent {
    /**
     * i18n-Schlüssel für die Meldung.
     */
    @Input() messageKey: string | null = 'LIGAUEBERSICHT.STATUS.EMPTY';

    /**
     * FontAwesome Icon-Klasse (ohne 'fa' Prefix).
     */
    @Input() icon = 'fa-folder-open';
}
