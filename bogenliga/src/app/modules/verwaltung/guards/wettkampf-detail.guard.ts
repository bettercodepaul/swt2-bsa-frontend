import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class WettkampfDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READ_WETTKAMPF or CAN_READ_MY_VERANSTALTUNG or CAN_READ_STAMMDATEN or CAN_READ_MY_ORT required to activate Wettkampf Detail
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_WETTKAMPF, UserPermission.CAN_READ_MY_VERANSTALTUNG, UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_READ_MY_ORT]);
  }
}
