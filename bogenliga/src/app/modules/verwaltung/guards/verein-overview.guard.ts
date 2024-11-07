import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class VereinOverviewGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_STAMMDATEN or CAN_CREATE_MANNSCHAFT required to activate Verein Overview
    // added "CAN_READ_DEFAULT" for opening Vereinsseite for every permission
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_DEFAULT, UserPermission.CAN_MODIFY_STAMMDATEN, UserPermission.CAN_CREATE_MANNSCHAFT]);
  }
}
