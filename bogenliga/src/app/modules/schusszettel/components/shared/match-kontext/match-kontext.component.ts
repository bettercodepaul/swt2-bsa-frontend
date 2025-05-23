import {
  Component,
  Input,
  ChangeDetectionStrategy
} from '@angular/core';
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

  /** for displaying today’s date */
  public today = new Date();
}
