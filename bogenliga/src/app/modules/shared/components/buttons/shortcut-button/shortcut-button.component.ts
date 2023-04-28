import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserService, UserPermission} from '@shared/services';
import {UserRoleEnum} from '@shared/services/current-user/types/user-role.enum';
import {RoleDataProviderService} from '@verwaltung/services/role-data-provider.service';
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
  constructor(private currentUserService: CurrentUserService) {}

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};





  ngOnInit(): void {}

  /**
   * Checks if the current user has any of the provided user roles.
   *
   * @param userRoles An array of UserRoleEnum values representing the roles to check for.
   * @returns `true` if the current user has any of the provided roles, `false` otherwise.
   */
  public hasUserRole(userRoles: UserRoleEnum[]): boolean {
    let roleAvailable = false;
    for (let role of userRoles) {
      if (this.currentUserId === role) {
        roleAvailable = true;
      }
    }
    return roleAvailable;
  }

  /**
   * Checks if the current user has any of the provided user permissions.
   *
   * @param userPermissions An array of UserPermission objects representing the permissions to check for.
   * @returns `true` if the current user has any of the provided permissions, `false` otherwise. Returns `true` if `userPermissions` is `undefined`.
   */
  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }

  /**
   * Checks if the current user has the necessary permissions and roles to access the shortcut buttons specified in the configuration.
   *
   * @returns `true` if the current user has the necessary permissions and roles to access any of the shortcut buttons, `false` otherwise.
   */
  public checkPermissions(): boolean {
    let permissionAvailable = false;
    for (let button of this.config.shortcutButtons) {
      if (this.hasUserPermissions(button.permissions) && this.hasUserRole(button.roles)) {
        permissionAvailable = true;
      }
    }
    return permissionAvailable;
  }


}
