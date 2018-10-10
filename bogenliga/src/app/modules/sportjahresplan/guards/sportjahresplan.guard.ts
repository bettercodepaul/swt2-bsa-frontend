import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class SportjahresplanGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_SPORTJAHR, UserPermission.CAN_MODIFY_SPORTJAHR]);
  }
}
