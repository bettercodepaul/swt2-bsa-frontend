import { Component, Input } from '@angular/core';

export type TabletStatus =
  | 'NOT_ALLOWED'
  | 'WARTE'
  | 'SCHUETZENMELDUNG'
  | 'SATZEINGABE'
  | 'MATCH_ENDE'
  | 'WETTKAMPF_BEENDET'
  | string;

type StepKey =
  | 'UEBERSICHT'
  | 'SCHUETZENMELDUNG'
  | 'SATZEINGABE'
  | 'WARTE';

@Component({
  selector: 'bla-tablet-statusleiste',
  templateUrl: './tablet-statusleiste.component.html',
  styleUrls: ['./tablet-statusleiste.component.scss'],
})
export class TabletStatusleisteComponent {
  @Input() status!: TabletStatus;
  @Input() showZustandFirst = true;

  /** Status, bei dem wir die Leiste gar nicht anzeigen wollen */
  get hideBar(): boolean {
    return this.status === 'NOT_ALLOWED';
  }

  /** Schritte dynamisch nach aktuellem Status */
  get steps(): Array<{ key: StepKey; label: string }> {
    const base: Array<{ key: StepKey; label: string }> = [
      { key: 'UEBERSICHT', label: 'Übersicht' },
    ];

    if (this.status === 'SCHUETZENMELDUNG') {
      return [
        ...base,
        { key: 'SCHUETZENMELDUNG', label: 'Schützenmeldung' },
        { key: 'SATZEINGABE', label: 'Passeeingabe' },
        { key: 'WARTE', label: 'Warten' },
      ];
    }

    if (this.status === 'SATZEINGABE') {
      return [
        ...base,
        { key: 'SATZEINGABE', label: 'Pässe' },
        { key: 'WARTE', label: 'Warten' },
      ];
    }

    if (this.status === 'WARTE') {
      return [
        ...base,
        { key: 'WARTE', label: 'Warten' },
      ];
    }

    // Für andere Stati (MATCH_ENDE, WETTKAMPF_BEENDET, unknown)
    return base;
  }


  private get currentStepKey(): StepKey | null {
    if (this.status === 'SCHUETZENMELDUNG') return 'SCHUETZENMELDUNG';
    if (this.status === 'SATZEINGABE') return 'SATZEINGABE';
    if (this.status === 'WARTE') return 'WARTE';
    return null;
  }


  private get activeStepKey(): StepKey | null {
    if (
      this.showZustandFirst &&
      (this.status === 'SCHUETZENMELDUNG' || this.status === 'SATZEINGABE')
    ) {
      return 'UEBERSICHT';
    }
    return this.currentStepKey;
  }


  get activeIndex(): number {
    const key = this.activeStepKey;
    if (!key) return -1;
    return this.steps.findIndex((s) => s.key === key);
  }

  isActive(i: number): boolean {
    return i === this.activeIndex;
  }

  isDone(i: number): boolean {
    return this.activeIndex >= 0 && i < this.activeIndex;
  }

}
