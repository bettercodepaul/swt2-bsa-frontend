import { Component, Input, Output, EventEmitter, ChangeDetectionStrategy } from '@angular/core';

/**
 * Fehleranzeige-Komponente mit optionalem Retry-Button.
 * Zeigt benutzerfreundliche Fehlermeldungen bei API-Fehlern.
 */
@Component({
    selector: 'bla-error-state',
    templateUrl: './error-state.component.html',
    styleUrls: ['./error-state.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ErrorStateComponent {
    /**
     * i18n-Schlüssel für die Fehlermeldung.
     */
    @Input() messageKey: string | null = 'LIGAUEBERSICHT.STATUS.ERROR';

    /**
     * Ob der Retry-Button angezeigt werden soll.
     */
    @Input() showRetry = true;

    /**
     * Event, das beim Klick auf den Retry-Button ausgelöst wird.
     */
    @Output() readonly retry = new EventEmitter<void>();

    onRetryClick(): void {
        this.retry.emit();
    }
}
