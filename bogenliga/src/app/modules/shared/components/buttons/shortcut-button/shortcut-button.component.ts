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

  public hasUserRole(userRoles: UserRoleEnum[]): boolean {
    let roleAvailable = false;
    console.log("CurrUserID: " + this.currentUserId + "userRolesEnum: " + userRoles);
    for (let role of userRoles) {
      if (this.currentUserId === role) {
        roleAvailable = true;
      }
    }
    return roleAvailable;
  }
  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }

  public checkPermissions(){
    let permissionAvailable = false;
    for(let button of this.config.shortcutButtons){
      if(this.hasUserPermissions(button.permissions) && this.hasUserRole(button.roles)){
        permissionAvailable = true;
      }
    }
    return permissionAvailable;
  }


}
