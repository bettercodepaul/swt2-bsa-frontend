import {CurrentUserService, UserPermission} from '../../services/current-user';
import {CommonComponentDirective} from './common-component.class';
import { Directive } from '@angular/core';

@Directive()
export class CommonSecuredDirective extends CommonComponentDirective {

  public userPermissions: UserPermission[];

  constructor(private userService: CurrentUserService) {
    super();
    this.userPermissions = userService.getPermissions();
  }
}
