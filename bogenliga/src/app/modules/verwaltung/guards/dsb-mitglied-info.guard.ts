import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class DsbMitgliedInfoGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READ_DSBMITGLIEDER required to activate DSB Mitglied INFO
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_DSBMITGLIEDER]);
  }
}
