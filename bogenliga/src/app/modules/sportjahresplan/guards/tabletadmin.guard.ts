import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class TabletadminGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_MY_WETTKAMPF or CAN_OPERATE_SPOTTING required to activate Tablet Admin
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_MODIFY_MY_VERANSTALTUNG, UserPermission.CAN_OPERATE_SPOTTING]);
  }
}
