import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class BenutzerNeuGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_DSBMITGLIEDER or CAN_MODIFY_VEREIN_DSBMITGLIEDER required to activate Benutzer Neu
    return this.currentUserService.hasAnyPermisson(
    [UserPermission.CAN_MODIFY_SYSTEMDATEN, UserPermission.CAN_CREATE_SYSTEMDATEN]);
  }
}
