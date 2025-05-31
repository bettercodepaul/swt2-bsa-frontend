import {ChangeDetectionStrategy, Component, Input} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';

@Component({
  selector: 'bla-maske4wettkampbeendet',
  templateUrl: './wettkampfbeendet.component.html',
  styleUrls: ['./wettkampfbeendet.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WettkampfbeendetComponent {
  /** full tablet state; only render when set */
  @Input() infos: TabletSchusszettel | null = null;

  /** allow user to reload or navigate away */
  reload(): void {
    window.location.reload();
  }
}
