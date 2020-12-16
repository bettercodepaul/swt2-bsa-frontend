import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class BenutzerNeuGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.currentUserService.hasAnyPermisson(
      // TODO: Should it be User.Permsissions.CAN_MODIFY_SYSTEMDATEN, User.Permissions.CREATE_SYSTEMDATEN
      // see https://www.exxcellent.de/confluence/display/BSAPP/Rollentabelle
      // [UserPermission.CAN_MODIFY_DSBMITGLIEDER, UserPermission.CAN_MODIFY_VEREIN_DSBMITGLIEDER]);
    [UserPermission.CAN_MODIFY_SYSTEMDATEN, UserPermission.CAN_CREATE_SYSTEMDATEN]);
  }
}
