import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class WettkampfDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_WETTKAMPF,UserPermission.CAN_READ_MY_VERANSTALTUNG,UserPermission.CAN_READ_STAMMDATEN]);
  }
}
