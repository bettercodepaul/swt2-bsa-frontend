import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TabletSchusszettel} from '@schusszettel/models/tablet-schusszettel.model';

@Component({
  selector: 'bla-match-kontext',
  templateUrl: './match-kontext.component.html',
  styleUrls: ['./match-kontext.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MatchKontextComponent {
  /** full tablet state; may be null until loaded */
  @Input() infos: TabletSchusszettel | null = null;

  get wettkampfName(): string {
    return this.infos?.wettkampfInfo?.wettkampftypName || 'Unbekannt';
  }

  get ligaName(): string {
    return this.infos?.wettkampfInfo?.ligaName || this.infos?.wettkampfInfo?.veranstaltungName || 'Unbekannt';
  }

  get veranstaltungName(): string {
    return this.infos?.wettkampfInfo?.veranstaltungName || 'Unbekannt';
  }

  get wettkampfTag(): number | string {
    return this.infos?.wettkampfInfo?.wettkampfTag || 'Unbekannt';
  }

  get sportjahr(): number | string {
    return this.infos?.wettkampfInfo?.veranstaltungSportjahr || 'Unbekannt';
  }


  /** Get current passe number using backend-provided value with fallback */
  getCurrentPasse(): number {
    // Use backend-provided currentPasseNumber if available
    if (this.infos?.currentPasseNumber != null && this.infos.currentPasseNumber > 0) {
      return this.infos.currentPasseNumber;
    }


    // Fallback calculation if backend value not available
    if (!this.infos?.satzErgebnisse || this.infos.satzErgebnisse.length === 0) {
      return 1;
    }

    const completedPasses = this.infos.satzErgebnisse.length;
    return completedPasses + 1;
  }

  /** Get the match number for the own team */
  getEigenesTeamMatchNr(): number | undefined {
    return this.infos?.eigenesTeamMatchNr;
  }

}
