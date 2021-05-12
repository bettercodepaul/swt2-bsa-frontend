import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class VeranstaltungDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_MY_VERANSTALTUNG or CAN_MODIFY_STAMMDATEN required to activate Veranstaltung Detail
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_MODIFY_MY_VERANSTALTUNG, UserPermission.CAN_MODIFY_STAMMDATEN]);
  }
}
