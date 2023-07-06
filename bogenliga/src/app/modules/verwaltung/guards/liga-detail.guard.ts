import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class LigaDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_SYSTEMDATEN required to activate Liga Detail
    return this.currentUserService.hasPermission(
      UserPermission.CAN_MODIFY_SYSTEMDATEN) || this.currentUserService.hasPermission(
      UserPermission.CAN_MODIFY_SYSTEMDATEN_LIGALEITER);
  }
}
