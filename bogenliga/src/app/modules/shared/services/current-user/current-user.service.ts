import {Injectable} from '@angular/core';
import {UserPermission} from './types/user-permission.enum';
import {LocalDataProviderService} from '../../local-data-provider/services/local-data-provider.service';
import {UserSignInDTO} from './types/user-sign-in-dto.class';
import {TOGGLE_SIDEBAR} from "../../redux-store/feature/sidebar";
import {Store} from "@ngrx/store";
import {AppState} from "../../redux-store";
import {LOGIN} from "../../redux-store/feature/user";

const CURRENT_USER_KEY = 'current_user';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {


  constructor(private localDataProviderService: LocalDataProviderService, private store: Store<AppState>) {
  }

  public persistCurrentUser(currentUser: UserSignInDTO): void {
    this.localDataProviderService.setPermanently(CURRENT_USER_KEY, JSON.stringify(currentUser));
    this.store.dispatch({ type: LOGIN, user: this.localDataProviderService.get(CURRENT_USER_KEY) });
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
    if ( currentUserValue != null ) {
      return UserSignInDTO.copyFromJson(JSON.parse(currentUserValue));
    }
    return new UserSignInDTO();
  }

  public isLoggedIn(): boolean {
    if (this.getUserId() === null ) {
      return true;
    }
    return false;
  }

  public logout() {
    this.localDataProviderService.remove(CURRENT_USER_KEY);
  }
}
