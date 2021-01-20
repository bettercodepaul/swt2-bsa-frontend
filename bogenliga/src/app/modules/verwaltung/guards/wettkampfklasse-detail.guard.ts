import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class WettkampfklasseDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_SYSTEMDATEN required to activate Wettkampfklasse Detail
    return this.currentUserService.hasPermission(
      UserPermission.CAN_MODIFY_SYSTEMDATEN);
  }
}
