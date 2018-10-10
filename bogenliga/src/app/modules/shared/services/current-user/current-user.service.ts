import {Injectable} from '@angular/core';
import {UserPermission} from './types/user-permission.enum';
import {LocalDataProviderService} from '../../local-data-provider/services/local-data-provider.service';
import {UserSignInDTO} from './types/user-sign-in-dto.class';
import {TOGGLE_SIDEBAR} from "../../redux-store/feature/sidebar";
import {select, Store} from "@ngrx/store";
import {AppState} from "../../redux-store";
import {LOGIN, UserState} from "../../redux-store/feature/user";
import {SideBarNavigationItem} from "../../../../components/sidebar/types/sidebar-navigation-item.interface";
import {isNullOrUndefined} from "util";

const CURRENT_USER_KEY = 'current_user';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {

  private isUserLoggedIn: boolean;


  constructor(private localDataProviderService: LocalDataProviderService, private store: Store<AppState>) {
    store.pipe(select('userState')).subscribe((state: UserState) => this.isUserLoggedIn = state.isLoggedIn );
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

  public hasAnyPermisson(requiredPermissions: UserPermission[]): boolean {
    const userPermissions: UserPermission[] = this.getPermissions();
    if (requiredPermissions.length > 0 && this.isUserLoggedIn === false ) { // no user and data needs permission --> access denied
      return false;
    } else if (requiredPermissions.length === 0) { // no permissions needed
      return true;
    } else if (requiredPermissions.length > 0 && this.isUserLoggedIn === false ) { // no user and data needs permission --> access denied
      return false;
    } else if (isNullOrUndefined(userPermissions) || userPermissions.length === 0) {
      // permissions needed but user has none
      return false;
    }
    for (const requiredPermission of requiredPermissions) {
      if (userPermissions.indexOf(userPermissions[requiredPermission]) >= 0) {
        return true;
      }
    }
    return false;
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
