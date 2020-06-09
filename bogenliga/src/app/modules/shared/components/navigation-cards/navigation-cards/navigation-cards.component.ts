import {Component, Input, OnInit} from '@angular/core';
import {CommonComponent} from '../../common';
import {NavigationCardsConfig} from '../types/navigation-cards-config.interface';
import {CurrentUserService, UserPermission} from '@shared/services';

@Component({
  selector:    'bla-navigation-cards',
  templateUrl: './navigation-cards.component.html',
  styleUrls:   ['./navigation-cards.component.scss']
})
export class NavigationCardsComponent extends CommonComponent implements OnInit {

  @Input() public config: NavigationCardsConfig = {navigationCards: []};

  constructor(private currentUserService: CurrentUserService) {
    super();
  }

  ngOnInit() {
  }
  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    return this.currentUserService.hasAnyPermisson(userPermissions);
  }

}
