import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class TableteingabeGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_OPERATE_SPOTTING required to activate Tablet Eingabe
    return this.currentUserService.hasPermission(
      UserPermission.CAN_OPERATE_SPOTTING);
  }
}
