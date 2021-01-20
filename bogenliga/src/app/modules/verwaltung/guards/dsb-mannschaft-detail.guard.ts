import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class DsbMannschaftDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READMY_VEREIN or CAN_READ_STAMMDATEN or CAN_CREATE_MANNSCHAFT required to activate DSB Mannschaft Detail
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_MY_VEREIN, UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_CREATE_MANNSCHAFT]);
  }
}
