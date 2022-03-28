import {Component, Input, OnInit} from '@angular/core';
import {CommonComponentDirective} from '../../common';
import {NavigationCardsConfig} from '../types/navigation-cards-config.interface';
import {CurrentUserService, UserPermission} from '@shared/services';

@Component({
  selector:    'bla-navigation-cards',
  templateUrl: './navigation-cards.component.html',
  styleUrls:   ['./navigation-cards.component.scss']
})
export class NavigationCardsComponent extends CommonComponentDirective implements OnInit {

  @Input() public config: NavigationCardsConfig = {navigationCards: []};
  activeCard: any = null;
  constructor(private currentUserService: CurrentUserService) {
    super();
  }

  ngOnInit() {
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }
  public getLink(route: string, detailType: string): string {
    if (detailType !== undefined) {
    let result = route;
    let allowedData: number[] = [];
    switch (detailType) {
      case('Veranstalltungen'):
        if (this.currentUserService.hasPermission(UserPermission.CAN_READ_MY_VERANSTALTUNG ) && !this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN ) ) {
        allowedData = this.currentUserService.getVeranstaltungen(); }
        break;
      case('Verein'):
        if (this.currentUserService.hasPermission(UserPermission.CAN_READ_MY_VEREIN) &&
          !this.currentUserService.hasPermission(UserPermission.CAN_MODIFY_STAMMDATEN)
          && ! this.currentUserService.hasPermission(UserPermission.CAN_CREATE_MANNSCHAFT)) {
        allowedData = [this.currentUserService.getVerein()]; }
        break;
    }
    if (allowedData.length > 0) {
      if (allowedData.length === 1) {
       result += '/' + allowedData[0].toString();
      }
    }

    return result;
    } else {
      return route;
    }
  }

  /*
  setting the card which is hovered */
  public setActiveCard(card) {
    this.activeCard = card
  }

  /*
  * resets the card which is hovered
  * get's called with the mouseleave event
  * of the button */
  public resetActiveCard() {
    this.activeCard = null
  }

  public getTooltipTitle() {
    return this.activeCard.tooltipTitle
  }

  /**
   * @return Tooltiptext of the card */
  public getTooltipText() {
    return this.activeCard.tooltipText
  }
}
