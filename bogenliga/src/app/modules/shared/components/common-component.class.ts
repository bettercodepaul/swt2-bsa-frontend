import {Input} from '@angular/core';

export class CommonComponent {
  @Input() public id: string;
  @Input() public visible: boolean;
  @Input() public loading: boolean;
  @Input() public disabled: boolean;
}
