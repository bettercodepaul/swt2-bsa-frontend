import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserService, UserPermission} from '@shared/services';
import {RoleDataProviderService} from '@verwaltung/services/role-data-provider.service';
import {UserDataProviderService} from '@verwaltung/services/user-data-provider.service';
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

  @Input()
  public id: string;
  public  currentUserId = this.currentUserService.getCurrentUserID();
  public currentUserRole = this.userDataProviderService.findUserRoleById(this.currentUserId);

  public  currentRolename: string;
  constructor(private currentUserService: CurrentUserService, private userDataProviderService: UserDataProviderService) {}

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};





  ngOnInit(): void {

    const userRoleDo =  this.userDataProviderService.findUserRoleById(this.currentUserId);

    userRoleDo.then((value) => {

       this.currentRolename = value.payload[0].roleName;

    })
  }


  async getCurrentUserRole(){
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
    let result: boolean = false;

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
    for (let button of this.config.shortcutButtons) {
      if (this.hasUserPermissions(button.permissions) && this.hasUserRole(button.roles)) {
        permissionAvailable = true;
      }
    }
    return permissionAvailable;
  }


}
