import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService} from '../../shared/services/current-user';

@Injectable()
export class LigatabelleGuard implements CanActivate {
  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // no permission required to activate Ligatabelle
    return this.currentUserService.hasAnyPermisson(
      []);
  }
}
