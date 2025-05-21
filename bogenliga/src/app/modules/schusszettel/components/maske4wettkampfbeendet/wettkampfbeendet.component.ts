import {Component, Input} from '@angular/core';

@Component({
  selector:    'bla-maske4wettkampbeendet',
  templateUrl: './wettkampfbeendet.component.html',
  styleUrls:   ['./wettkampfbeendet.component.scss']
})
export class WettkampfbeendetComponent {
  @Input() infos: any;
}
