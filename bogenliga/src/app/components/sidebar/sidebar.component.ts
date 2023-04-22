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


const ID_PATH_PARAM = 'id';


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
  public ligaID2: number;

  public testHref: string;



  faCaretDown = faCaretDown;

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService, private router: Router, private route: ActivatedRoute, private onOfflineService: OnOfflineService) {
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);

  }

 ngOnInit() {
    this.offlineSetter();
    console.log("ONINIT");

    /*

   this.route.params.subscribe((params) => {
     if (1 == 1/!*!isUndefined(params[ID_PATH_PARAM])*!/) {

       console.log(params[ID_PATH_PARAM]);
       this.ligaID2 = parseInt(params[ID_PATH_PARAM], 10);
       this.ligaID2 = 99
       console.log('Provided Id = = =  ', this.ligaID2);
       this.hasLigaID = true;
     } else {
       console.log('no params On INIT sidebar');
     }
   });*/

   /*this.ligaID2 = 99;*/

   console.log("ONINIT with ID = = =" + this.ligaID2);

  }

/*  onLinkClick($event: MouseEvent) {
    console.log("Click logged");
    //auslesen von id
    this.testHref = this.router.url;
    console.log(this.router.url);

    if(this.testHref.startsWith("/ligatabelle")){
      const lastSlashIndex = this.testHref.lastIndexOf('/');
      this.ligaID2 = parseInt(this.testHref.substring(lastSlashIndex + 1));

      console.log("---------result liga id: " + this.ligaID2);
    }
  }*/


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

      this.testHref = this.router.url;
      /*console.log(this.router.url);    IGNORE THIS*/
      if (this.testHref.startsWith("/ligatabelle") ||this.testHref.startsWith("/home") ) {
        const lastSlashIndex = this.testHref.lastIndexOf('/');
        switch(lastSlashIndex){
          case 0:
            this.ligaID2 = undefined;
            break;
          case 12:
            this.ligaID2 = parseInt(this.testHref.substring(lastSlashIndex + 1));
            break;
          case 5:
            this.ligaID2 = parseInt(this.testHref.substring(lastSlashIndex + 1));
            break;
        }
      }



    if (detailType === 'undefined') {
     return(route);
    } else {
      switch (detailType) {
        case 'verein':
          result = result + '/' + this.currentUserService.getVerein();
          break;
        default:
            if (this.ligaID2 != undefined && route.startsWith("/home")){
              result =  result + '/'+ this.ligaID2.toString();
          } else if(this.ligaID2 != undefined && route.startsWith("/ligatabelle")){
              result =  result + '/'+ this.ligaID2.toString();
            }
            else{
            result = result;
          }

          break;

      }
      return result;
    }
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

}
