import {Injectable} from '@angular/core';
import {Router} from '@angular/router';
import {select, Store} from '@ngrx/store';
import {isNullOrUndefined} from '@shared/functions';
import {filter, map} from 'rxjs/operators';
import {LocalDataProviderService} from '@shared/local-data-provider';
import {AppState, Login, Logout} from '../../redux-store';
import {UserState} from '@shared/redux-store';
import {Notification, NotificationUserAction} from '../notification/types';
import {UserPermission} from '../current-user/types/user-permission.enum';
import {UserSignInDTO} from '../current-user/types/user-sign-in-dto.class';

const CURRENT_USER_KEY = 'current_user';
const LOGIN_EMAIL_KEY = 'login_email';
const DEFAULT_USERNAME = 'ligadefault';
const CURRENT_USER_PERMISSION = 'current_permissions';


@Injectable({
  providedIn: 'root'
})
export class CurrentUserService {


  private isUserLoggedIn: boolean;
  private isDefaultUserLoggedIn: boolean;
  private currentUser: UserSignInDTO = new UserSignInDTO();
  private currentUserPermissions: UserPermission[];



  constructor(private localDataProviderService: LocalDataProviderService,
              private store: Store<AppState>,
              private router: Router) {
    this.observeUserState();
    this.observeSessionExpiredNotifications();
    this.loadCurrentUser();
  }

  public disableDefaultUser(): void {
    this.isDefaultUserLoggedIn = false;
  }

  public persistCurrentUser(currentUser: UserSignInDTO): void {
    this.localDataProviderService.setPermanently(CURRENT_USER_KEY, JSON.stringify(currentUser));
    this.store.dispatch(new Login(currentUser, this.isDefaultUserLoggedIn));
    // load current User after persisting the token
    this.loadCurrentUser();
  }

  public loadCurrentUser(): void {
    this.currentUserPermissions = [];
    console.log('Load current user from storage');
    const currentUserValue = this.localDataProviderService.get(CURRENT_USER_KEY);

    // Track the default user
    let isDefault: boolean;
    if (currentUserValue != null) {
      // Map the permissions from the redux to its values
      const currentUserJSONMap = JSON.parse(currentUserValue);
      if (currentUserJSONMap.permissions) {
        currentUserJSONMap.permissions.forEach((permission) => {
          const userPermit = (UserPermission as any) [permission];
          this.currentUserPermissions.push(userPermit);
        });
      }
      const json = UserSignInDTO.copyFromJson(JSON.parse(currentUserValue));
      // At this point we cannot be sure if the user is default or not, so we check the raw json directly
      if (json.email === DEFAULT_USERNAME) {
        isDefault = true;
      } else {
        isDefault = false;
      }
      this.store.dispatch(new Login(json, isDefault));
    }
    console.log('CurrentUserValue: ' + currentUserValue);
    console.log('CurrentUserPermission: ' + this.currentUserPermissions);
    console.log('DefaultUser: ' + isDefault);
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
    return this.currentUserPermissions;
  }

  public hasPermission(permission: UserPermission): boolean {
    return this.currentUserPermissions.indexOf(permission) >= 0;
  }

  // TODO: remove this function because it has no use
  public hasAllPermissions(requiredPermissions: UserPermission[]): boolean {
    const userPermissions: UserPermission[] = this.getPermissions();

    // preconditions
    if (this.isUserLoggedIn === false) { // no user and data needs permission --> access denied
      return false;
    } else if (requiredPermissions.length === 0) { // no permissions needed
      return true;
    } else if (isNullOrUndefined(userPermissions) || userPermissions.length === 0) {
      // permissions needed but user has none
      return false;
    }
    // return true when user has all required permissions
    return requiredPermissions.every(function hasPermissions(value) {
      return (userPermissions.indexOf(value) >= 0);
    });
  }

  // Q: why requiredPermission.length == 0 ==> true ?
  public hasAnyPermisson(requiredPermissions: UserPermission[]): boolean {
    const userPermissions: UserPermission[] = this.getPermissions();

    // preconditions
    if (requiredPermissions.length > 0 && this.isUserLoggedIn === false) {
      // no user and data needs permission --> access denied
      return false;
    } else if (requiredPermissions.length === 0) { // no permissions needed
      return true;
    } else if (isNullOrUndefined(userPermissions) || userPermissions.length === 0) {
      // permissions needed but user has none
      return false;
    }
    // return true when user has any required permissions
    for (const requiredPermission of requiredPermissions) {
      if (userPermissions.indexOf(requiredPermission) >= 0) {
        return true;
      }
    }
    return false;
  }

  public isLoggedIn(): boolean {
    return this.isUserLoggedIn;
  }

  // TODO: remove because unused
  public isDefaultUser(): boolean {
    return this.isDefaultUserLoggedIn;
  }

  public logout() {
    this.localDataProviderService.remove(CURRENT_USER_KEY);
    this.store.dispatch(new Logout());
  }

  public rememberUsername(email: string) {
    this.localDataProviderService.setPermanently(LOGIN_EMAIL_KEY, email);
  }

  public getRememberedUsername(): string {
    return this.localDataProviderService.get(LOGIN_EMAIL_KEY);
  }

  public forgetUsername(): void {
    return this.localDataProviderService.remove(LOGIN_EMAIL_KEY);
  }


  private observeUserState() {
    this.store.pipe(select((state) => state.userState))
        .subscribe((state: UserState) => {
          this.isUserLoggedIn = state.isLoggedIn;
          this.currentUser = isNullOrUndefined(state.user) ? new UserSignInDTO() : state.user;
          if (this.currentUser.email === DEFAULT_USERNAME) {
            this.isDefaultUserLoggedIn = true;
          } else {
            this.isDefaultUserLoggedIn = false;
          }
        });
  }

  private observeSessionExpiredNotifications() {
    this.store.pipe(
      select((state) => state.notificationState),
      filter((notificationState) => !isNullOrUndefined(notificationState.notification)),
      map((notificationState) => notificationState.notification),
      filter((notification) => notification.id === 'NO_SESSION_ERROR'),
      filter((notification) => notification.userAction === NotificationUserAction.ACCEPTED)
    ).subscribe((notification: Notification) => {
      // dont logout user if the application is in offlinemode
      this.store.select((state) => state.onOfflineState.isOffline).subscribe((offline) => {
        if (offline) {
          return;
        }
      });
      console.log('ExpiredNotification');
      this.logout();
      this.router.navigateByUrl('/user/login');
    });
  }

  private getCurrentUser(): UserSignInDTO {
    return this.currentUser;
  }

  public getVerein(): number {
    return this.getCurrentUser().vereinId;
  }

  public getVeranstaltungen(): number[] {
      return  this.getCurrentUser().veranstaltungenIds;
  }

  public hasVeranstaltung(input: number): boolean {
      return this.getVeranstaltungen().includes(input);
  }
  public getCurrentUserID(): number {
    return this.currentUser.id;
  }
}
