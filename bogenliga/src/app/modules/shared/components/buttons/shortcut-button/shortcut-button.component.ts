import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserService, UserPermission} from '@shared/services';
import {RoleDataProviderService} from '@verwaltung/services/role-data-provider.service';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';
import {LoginDataProviderService} from '@user/services/login-data-provider.service';

import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';
import {RoleDTO} from '@verwaltung/types/datatransfer/role-dto.class';

@Component({
  selector: 'bla-shortcut-button',
  templateUrl: './shortcut-button.component.html',
  styleUrls: ['./shortcut-button.component.scss']
})


export class ShortcutButton implements OnInit {
  constructor(private currentUserService: CurrentUserService, private userDataProviderService: UserDataProviderService, private loginDataproviderService: LoginDataProviderService) {

  }

  public id: string;
  public  currentUserId;
  public currentUserRole;

  public  currentRolename: string;

  public VereinsID: number;

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};

  private void;


  public setCorrectID() {
    const verein = this.currentUserService.getVerein();
    this.VereinsID = verein;
  }

  public getCorrectLink(): String {
    return '/verwaltung/vereine/' + this.VereinsID;
  }

  ngOnInit(): void {
    if (this.currentUserService.isLoggedIn() === false) {
       this.loginDataproviderService.signInDefaultUser()
        .then(() => {
          this.setup();
        });
    } else {
      this.setup();
    }





  }
  private setup(): void {

    this.currentUserId = this.currentUserService.getCurrentUserID();
    this.currentUserRole = this.userDataProviderService.findUserRoleById(this.currentUserId);
    this.setCorrectID();
    const userRoleDo =  this.currentUserRole;

    userRoleDo.then((value) => {

      this.currentRolename = value.payload[0].roleName;

    });


  }


  async getCurrentUserRole() {
    const userRoleDo = await  this.userDataProviderService.findUserRoleById(this.currentUserId);

    const currentRolename = userRoleDo.payload[0].roleName;

    return currentRolename;

  }

  /**
   * Checks if the current user has any of the specified roles.
   *
   * @param roles An array of strings representing the roles to check for.
   * @returns `true` if the current user has any of the specified roles, `false` otherwise.
   */
  public hasUserRole(roles: string[]): boolean {
    let result = false;

    // Check if the current role is undefined
    if (this.currentRolename === undefined) {
      result;
    } else {
      // Check if the current user has any of the specified roles
      result = this.currentUserService.hasAnyRole(roles, this.currentRolename);
    }

    return result;
  }

  /**
   * Checks if the current user has any of the provided user permissions.
   *
   * @param userPermissions An array of UserPermission objects representing the permissions to check for.
   * @returns `true` if the current user has any of the provided permissions, `false` otherwise. Returns `true` if
   *   `userPermissions` is `undefined`.
   */
  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }

  /**
   * Checks if the current user has the necessary permissions and roles to access the shortcut buttons specified in the
   * configuration.
   *
   * @returns `true` if the current user has the necessary permissions and roles to access any of the shortcut buttons,
   *   `false` otherwise.
   */
  checkPermissions(): boolean {

    let permissionAvailable = false;
    for (const button of this.config.shortcutButtons) {
      if (this.hasUserPermissions(button.permissions) && this.hasUserRole(button.roles)) {
        permissionAvailable = true;
      }
    }
    return permissionAvailable;
  }


}
