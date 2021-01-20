import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class WettkampftageGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READ_MY_VERANSTALTUNG or CAN_MODIFY_WETTKAMPF or CAN_MODIFY_MY_ORT required to activate Wettkampftage
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_MY_VERANSTALTUNG, UserPermission.CAN_MODIFY_WETTKAMPF, UserPermission.CAN_MODIFY_MY_ORT]);
  }
}
