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

  /** Getter methods to safely access wettkampfInfo properties */
  get today(): string {
    return this.infos?.wettkampfInfo?.wettkampfDatum
      ? new Date(this.infos.wettkampfInfo.wettkampfDatum).toLocaleDateString('de-DE')
      : new Date().toLocaleDateString('de-DE');
  }

  get wettkampfName(): string {
    return this.infos?.wettkampfInfo?.wettkampftypName || 'Unbekannt';
  }

  get ligaName(): string {
    return this.infos?.wettkampfInfo?.ligaName || this.infos?.wettkampfInfo?.veranstaltungName || 'Unbekannt';
  }

  get veranstaltungName(): string {
    return this.infos?.wettkampfInfo?.veranstaltungName || 'Unbekannt';
  }

  get ort(): string {
    const ortsname = this.infos?.wettkampfInfo?.wettkampfOrtsname || '';
    const ortsinfo = this.infos?.wettkampfInfo?.wettkampfOrtsinfo || '';

    if (ortsname && ortsinfo) {
      return `${ortsname}, ${ortsinfo}`;
    }
    return ortsname || ortsinfo || 'Unbekannt';
  }

  get wettkampfTag(): number | string {
    return this.infos?.wettkampfInfo?.wettkampfTag || 'Unbekannt';
  }

  get beginn(): string {
    return this.infos?.wettkampfInfo?.wettkampfBeginn || 'Unbekannt';
  }

  get sportjahr(): number | string {
    return this.infos?.wettkampfInfo?.veranstaltungSportjahr || 'Unbekannt';
  }
}
