import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService} from '../../shared/services/current-user';

@Injectable()
export class HomeGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // no permission required to activate Home and Impressum
    return this.currentUserService.hasAnyPermisson(
      []);
  }
}
