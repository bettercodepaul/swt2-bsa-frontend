import {ChangeDetectionStrategy, Component, EventEmitter, Input, Output} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';

@Component({
  selector: 'bla-maske3aktualisierung',
  templateUrl: './warte-bestaetigung.component.html',
  styleUrls: ['./warte-bestaetigung.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class WarteBestaetigungComponent {
  /** full tablet state; render only when truthy */
  @Input() infos: TabletSchusszettel | null = null;

  /** emitted when the user clicks “Refresh Status” */
  @Output() refresh = new EventEmitter<void>();

  onRefreshClick(): void {
    console.log('User requested status refresh');
    this.refresh.emit();
  }
}
