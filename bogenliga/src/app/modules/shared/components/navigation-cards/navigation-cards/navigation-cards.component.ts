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
    if (userPermissions === undefined) {
      return true;
    } else {
      return this.currentUserService.hasAnyPermisson(userPermissions);
    }
  }
  public getLink(route:String,detailType:String):String{
    if(detailType !== undefined){
    let result = route;
    let allowedData :number[] = [];
    switch(detailType){
      case("Veranstalltungen"):
        if(this.currentUserService.hasPermission(UserPermission.CAN_READ_MY_VERANSTALTUNG)){
        allowedData = this.currentUserService.getVeranstaltungen();}
        break;
      case("Verein"):
        if(this.currentUserService.hasPermission(UserPermission.CAN_READ_MY_VEREIN)){
        allowedData = [this.currentUserService.getVerein()];}
        break;
    }
    if(allowedData.length > 0){
      if(allowedData.length == 1){
       result += "/"+allowedData[0].toString();
      }
    }

    return result;
    }else{
      return route
    }

  }

}
