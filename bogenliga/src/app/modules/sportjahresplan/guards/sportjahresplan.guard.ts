import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class SportjahresplanGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // CAN_READ_WETTKAMPF required to activate Sportjahresplan
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_MODIFY_WETTKAMPF]);
  }
}
