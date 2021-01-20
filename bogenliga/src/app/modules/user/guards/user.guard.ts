import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService, UserPermission} from '../../shared/services/current-user';

@Injectable()
export class UserGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // no permission required to activate User
    return this.currentUserService.hasAnyPermisson(
      []);
  }
}
