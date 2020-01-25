import {Injectable} from '@angular/core';
import {CanActivate} from '@angular/router';
import {CurrentUserService} from '@shared/services';

@Injectable()
export class AuthenticationGuard implements CanActivate {

  constructor(private currentUserService: CurrentUserService) {
  }

  canActivate() {
    return this.currentUserService.hasAnyPermisson(
      //ggf. Rechte nachtragen nach der Authentifizierung für Schreibenden Zugriff
      []);
  }
}
