import {CurrentUserService, UserPermission} from '../../services/current-user';
import {CommonComponent} from './common-component.class';
import { Directive } from "@angular/core";

@Directive()
export class CommonSecuredComponent extends CommonComponent {

  public userPermissions: UserPermission[];

  constructor(private userService: CurrentUserService) {
    super();
    this.userPermissions = userService.getPermissions();
  }
}
