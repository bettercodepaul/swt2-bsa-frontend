import {Component, Input, OnInit} from '@angular/core';
import {CurrentUserService, UserPermission} from '@shared/services';
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
  public  currentRole:string = "";
  constructor(private currentUserService: CurrentUserService, private currentUserRole: RoleDataProviderService) {


  }

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};





  ngOnInit(): void {



  }

  public async getCurrentRole (): Promise<string> {

    let rolesObj = await  this.currentUserRole.findAll();
    let roles: RoleDTO[] = rolesObj.payload;
    let currentRole: string = "";
    for (const role of roles) {
      if (role.id === this.currentUserId) {
        console.log('id: ' + role.id + ' currentUserId:' + this.currentUserId, " rolename: ", role.roleName);
        currentRole = role.roleName;
      }
    }
    console.log('currentrrole: ', currentRole)
    return  currentRole;

  }
  public hasUserRole(userRoles: string[]): boolean {

    // compare roles
    for (const userRole of userRoles) {

      if (userRole === this.currentRole) {
        console.log('display button', userRole);
        return true;
      }
    }

    return false;
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
      if(this.hasUserPermissions(button.permissions)){
        permissionAvailable = true;
      }
    }
    return permissionAvailable;
  }


}
