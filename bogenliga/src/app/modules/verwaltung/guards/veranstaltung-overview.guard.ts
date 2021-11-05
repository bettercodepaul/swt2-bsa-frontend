import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot} from '@angular/router';
import {Observable} from 'rxjs';
import {CurrentUserService, UserPermission} from '@shared/services';

@Injectable({
  providedIn: 'root'
})
export class VeranstaltungOverviewGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    // CAN_READ_STAMMDATEN or CAN_MODIFY_MY_VERANSTALTUNG required to activate Veranstaltung Overview
    return this.currentUserService.hasAnyPermisson(
      [UserPermission.CAN_READ_STAMMDATEN, UserPermission.CAN_MODIFY_MY_VERANSTALTUNG]);
  }
}
