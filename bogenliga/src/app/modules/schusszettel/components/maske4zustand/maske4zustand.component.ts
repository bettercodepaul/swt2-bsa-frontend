import {
  Component,
  Input,
  Output,
  EventEmitter,
  ChangeDetectionStrategy
} from '@angular/core';
import { TabletSchusszettel } from '../../models/tablet-schusszettel.model';

@Component({
  selector: 'bla-maske4zustand',
  templateUrl: './maske4zustand.component.html',
  styleUrls: ['./maske4zustand.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Maske4ZustandComponent {
  /** full tablet state; wait for it via *ngIf */
  @Input() infos: TabletSchusszettel | null = null;

  /** fires when “Weiter” is clicked */
  @Output() weiter = new EventEmitter<void>();

  onWeiter(): void {
    this.weiter.emit();
  }

  /** 1-based index of next passe */
  get currentPasse(): number {
    return (this.infos?.satzErgebnisse.length ?? 0) + 1;
  }

  /** accumulated match points for a given team */
  getMatchpunkte(teamId: number): number {
    return (
      this.infos?.matchErgebnis.find(m => m.teamId === teamId)?.matchpunkte ?? 0
    );
  }
}
