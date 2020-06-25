import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class DsbMitgliedDetailGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.currentUserService.hasAnyPermisson(//TODO Check if Sportleiter is allowed to modify
      [UserPermission.CAN_MODIFY_STAMMDATEN,UserPermission.CAN_MODIFY_MY_VEREIN]);
  }
}
