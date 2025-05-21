import {Component, Input} from '@angular/core';

@Component({
  selector:    'bla-maske5not-allowed',
  templateUrl: './not-allowed.component.html',
  styleUrls:   ['./not-allowed.component.scss']
})
export class NotAllowedComponent {
  @Input() infos: any;
}
