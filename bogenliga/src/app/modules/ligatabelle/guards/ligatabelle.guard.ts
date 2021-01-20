import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class LigatabelleGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // CAN_READ_DEFAULT required to activate Ligatabelle
    return this.currentUserService.hasPermission(
      UserPermission.CAN_READ_DEFAULT);
  }
}
