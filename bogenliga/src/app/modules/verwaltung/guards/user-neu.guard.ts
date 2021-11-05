import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class UserNeuGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_DSBMITGLIEDER or CAN_MODIFY_VEREIN_DSBMITGLIEDER required to activate User Neu
    return this.currentUserService.hasAnyPermisson(
    [UserPermission.CAN_MODIFY_SYSTEMDATEN, UserPermission.CAN_CREATE_SYSTEMDATEN, UserPermission.CAN_CREATE_SYSTEMDATEN_LIGALEITER, UserPermission.CAN_MODIFY_SYSTEMDATEN_LIGALEITER]);
  }
}
