import {Component, Input, OnInit} from '@angular/core';
import {NavigationCardsConfig} from '@shared/components/navigation-cards';
import {CurrentUserService, UserPermission} from '@shared/services';
import {
  ShortcutButtonsConfig
} from '@shared/components/buttons/shortcut-button/types/shortcut-buttons-config.interface';

@Component({
  selector: 'bla-shortcut-button',
  templateUrl: './shortcut-button.component.html',
  styleUrls: ['./shortcut-button.component.scss']
})
export class ShortcutButton implements OnInit {

  @Input()
  public id: string;
  constructor(private currentUserService: CurrentUserService) {
  }

  @Input() public config: ShortcutButtonsConfig = {shortcutButtons: []};



  ngOnInit(): void {

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
