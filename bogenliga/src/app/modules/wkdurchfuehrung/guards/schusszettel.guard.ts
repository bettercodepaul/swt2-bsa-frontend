import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable()
export class SchusszettelGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    // CAN_READ_MY_VERANSTALTUNG required to activate Schusszettel
    return this.currentUserService.hasPermission(
      UserPermission.CAN_READ_MY_VERANSTALTUNG);
  }
}
