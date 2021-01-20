import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class VerwaltungGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // CAN_READ_STAMMDATEN or CAN_READ_SYSTEMDATEN required to activate Veranstaltung
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_READ_SYSTEMDATEN]);
  }
}
