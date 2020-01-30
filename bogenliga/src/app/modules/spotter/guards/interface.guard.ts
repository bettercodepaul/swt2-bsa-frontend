import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';
import { CurrentUserService, UserPermission } from '@shared/services';

@Injectable()
export class InterfaceGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    return this.currentUserService.hasAnyPermisson([UserPermission.CAN_OPERATE_SPOTTING]);
  }
}
