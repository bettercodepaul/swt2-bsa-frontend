import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class WettkampfklasseOverviewGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READ_SYSTEMDATEN required to activate Wettkampfklasse Overview
    return this.currentUserService.hasPermission(
      UserPermission.CAN_READ_SYSTEMDATEN);
  }
}
