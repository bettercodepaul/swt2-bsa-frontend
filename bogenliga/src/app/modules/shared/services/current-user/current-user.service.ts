import {Injectable} from '@angular/core';
import {UserPermission} from './types/user-permission.enum';
import {LocalDataProviderService} from '../../local-data-provider/services/local-data-provider.service';
import {UserSignInDTO} from './types/user-sign-in-dto.class';

const CURRENT_USER_KEY = 'current_user';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {


  constructor(private localDataProviderService: LocalDataProviderService) {
  }

  public persistCurrentUser(currentUser: UserSignInDTO): void {
    this.localDataProviderService.setSessionScoped(CURRENT_USER_KEY, JSON.stringify(currentUser));
  }

  public getEmail(): string {
    return this.getCurrentUser().email;
  }

  public getUserId(): number {
    return this.getCurrentUser().id;

  }

  public getJsonWebToken(): string {
    return this.getCurrentUser().jwt;

  }

  public getPermissions(): UserPermission[] {
    return this.getCurrentUser().permissions;
  }


  public hasPermission(permission: UserPermission): boolean {
    return this.getCurrentUser().permissions.indexOf(permission) >= 0;
  }

  public hasAllPermissions(permission: UserPermission[]): boolean {
    if (0 === permission.length) {
      return false;
    }
    const currentPermissions = this.getCurrentUser().permissions;
    return permission.every(function (value) {
      return (currentPermissions.indexOf(value) >= 0);
    });
  }


  private getCurrentUser(): UserSignInDTO {
    const currentUserValue = this.localDataProviderService.get(CURRENT_USER_KEY);

    return new UserSignInDTO(JSON.parse(currentUserValue));
  }
}
