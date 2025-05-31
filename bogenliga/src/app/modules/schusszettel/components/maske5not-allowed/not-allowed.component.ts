import {Component, Input} from '@angular/core';
import {TabletSchusszettel} from '../../models/tablet-schusszettel.model';

@Component({
  selector: 'bla-maske5not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls: ['./not-allowed.component.scss']
})
export class NotAllowedComponent {
  @Input() infos!: TabletSchusszettel;

  /** reloads the page to let the user try again */
  retry(): void {
    window.location.reload();
  }
}
