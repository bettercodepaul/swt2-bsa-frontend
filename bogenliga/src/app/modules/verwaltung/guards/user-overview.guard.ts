import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class UserOverviewGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_DSBMITGLIEDER or CAN_MODIFY_VEREIN_DSBMITGLIEDER required to activate User Overview
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_SYSTEMDATEN]);
  }
}
