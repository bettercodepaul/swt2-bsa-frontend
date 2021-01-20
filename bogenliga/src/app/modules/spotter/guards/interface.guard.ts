import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUserService, UserPermission } from '@shared/services';

@Injectable()
export class InterfaceGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    // CAN_OPERATE_SPOTTING required to activate Spotter Interface
    return this.currentUserService.hasPermission(
      UserPermission.CAN_OPERATE_SPOTTING);
  }
}
