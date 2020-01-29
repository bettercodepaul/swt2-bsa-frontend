import {Input} from '@angular/core';
import {UserPermission} from '../../services/current-user';

export class CommonComponent {
  @Input() public id: string;
  @Input() public visible = true;
  @Input() public loading = false;
  @Input() public disabled = false;


  public userPermissions: UserPermission[] = [];

  constructor() {
  }
}
