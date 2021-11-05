import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class SchuetzenNeuGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_MODIFY_STAMMMDATEN or CAN_MODIFY_MY_VEREIN required to activate Schützen neu
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_MODIFY_STAMMDATEN, UserPermission.CAN_MODIFY_MY_VEREIN]);
  }
}
