import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class VerwaltungGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    return this.currentUserService.hasAnyPermisson(
      //TODO überprüfen ob es noch zusaetzliche Berechtigungen gibt
      [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_READ_SYSTEMDATEN]);
  }
}
