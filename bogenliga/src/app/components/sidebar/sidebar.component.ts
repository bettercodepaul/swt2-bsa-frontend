import {Component, OnInit} from '@angular/core';
import {ActivatedRoute,Router, ParamMap} from '@angular/router';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons';
import {select, Store} from '@ngrx/store';
import {isNullOrUndefined, isUndefined} from '@shared/functions';
import {environment} from '../../../environments/environment';
import {AppState, SidebarState, TOGGLE_SIDEBAR} from '../../modules/shared/redux-store';
import {CurrentUserService, UserPermission} from '../../modules/shared/services/current-user';
import {SIDE_BAR_CONFIG} from './sidebar.config';
import {SideBarNavigationSubitem} from './types/sidebar-navigation-subitem.interface';
import {SIDE_BAR_CONFIG_OFFLINE} from './sidebar.config';
import {OnOfflineService} from '@shared/services';
import {SelectedLigaDataprovider} from '../../modules/shared/data-provider/SelectedLigaDataprovider'



const ID_PATH_PARAM = 'id';
export var ligaID: number;

@Component({
  selector:    'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls:   [
    './sidebar.component.scss',
    './../../app.component.scss'
  ]
})


export class SidebarComponent implements OnInit {




  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public inProd = environment.production;
  public CONFIG;
  public hasLigaID: boolean;
  public ligaID: number;
  public URLRoute: string;



  faCaretDown = faCaretDown;

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService, private router: Router, private route: ActivatedRoute, private onOfflineService: OnOfflineService, private selectedLigaDataprovider: SelectedLigaDataprovider) {
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

 ngOnInit() {
    this.offlineSetter();
  }

// Um im Offlinemodus die Sidebar entsprechend anzupassen.
  public offlineSetter(): void {
    if (this.onOfflineService.isOffline() == true) {
      this.CONFIG = SIDE_BAR_CONFIG_OFFLINE;
    } else {
      this.CONFIG = SIDE_BAR_CONFIG;
    }

  }

  /**
   * tells store that sidebar button was used -> Sidebar needs to change
   */
  public toggleSidebar() {
    this.store.dispatch({type: TOGGLE_SIDEBAR});
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    return this.currentUserService.hasAnyPermisson(userPermissions);
  }
  public getRoute(route: string, detailType: string): string {
    let result: string = route;
    this.URLRoute = this.router.url;
    if (this.URLRoute.startsWith("/ligatabelle") ||this.URLRoute.startsWith("/home") ) {
      const lastSlashIndex = this.URLRoute.lastIndexOf('/');
      switch(lastSlashIndex){
        case 0:
          //forget liga ID if no liga ID is part of the URL-route
          this.ligaID = undefined;
          break;
        case result.length:
          !(this.URLRoute.substring(lastSlashIndex + 1).toString() === "ligaid") ?
          this.ligaID = parseInt(this.URLRoute.substring(lastSlashIndex + 1)) : undefined;
          break;
        }

      }

    if (detailType === 'undefined') {
     return(route);
    } else if (detailType === 'verein'){
          result = result + '/' + this.currentUserService.getVerein();
      } else {
      result = result;
    }

    if (this.ligaID != undefined && route.startsWith("/home")){
      result =  result + '/'+ this.ligaID.toString();
    } else if(this.ligaID != undefined && route.startsWith("/ligatabelle")){
      result =  result + '/'+ this.ligaID.toString();
    }

    this.selectedLigaDataprovider.setSelectedLigaID(this.ligaID);

    return result;
    }


  public getSidebarCollapseIcon(): string {
    return this.isActive ? 'angle-double-right' : 'angle-double-left';
  }

  existSubitems(subitems: SideBarNavigationSubitem[]): boolean {
    if (isNullOrUndefined(subitems)) {
      return false;
    } else if (subitems.length === 0) {
      return false;
    }
    return true;
  }

  isSelected(itemroute: string): boolean {
    return (this.router.url.indexOf(itemroute) >= 0);
  }

  public getID(): number {
    return this.ligaID;
}

}
