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



  faCaretDown = faCaretDown;

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService, private router: Router, private route: ActivatedRoute, private onOfflineService: OnOfflineService) {
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);

  }

 ngOnInit() {
    this.offlineSetter();
    console.log("ONINIT");
    this.ligaID2 = undefined;
   this.route.params.subscribe((params) => {
     if (!isUndefined(params[ID_PATH_PARAM])) {
       this.ligaID2 = parseInt(params[ID_PATH_PARAM], 10);
       console.log('Provided Id = = =  ', this.ligaID2);
       this.hasLigaID = true;
     } else {
       console.log('no params');
     }
   });

   /*this.ligaID2 = 99;*/

   console.log("ONINIT with ID = = =" + this.ligaID2);

  }
// Um im Offlinemodus die Sidebar entsprechend anzupassen.
  public offlineSetter(): void {
    if (this.onOfflineService.isOffline() == true) {
      this.CONFIG = SIDE_BAR_CONFIG_OFFLINE;
    } else {
      this.CONFIG = SIDE_BAR_CONFIG;
    }

  }
/*  onLinkClick(event : Event){
    console.log("Click logged");

    this.route.params.subscribe((params) => {
      if (!isUndefined(params[ID_PATH_PARAM])) {
        this.ligaID2 = parseInt(params[ID_PATH_PARAM], 10);
        console.log('Provided Id ', this.ligaID2);
        this.hasLigaID = true;

      } else {
        console.log('no params');
      }
    });

    this.ligaID2 = 99;

    console.log("CLICKED ID =====" + this.ligaID2);

    /!*this.ligaID2 = parseInt(this.route.snapshot.paramMap.get('id'));*!/

    /!*    const urlParts = this.route.snapshot.url;
     console.log(urlParts);
     if (urlParts.length > 0) {
     const ligaIDString = urlParts[urlParts.length - 1].path;
     this.ligaID2 = parseInt(ligaIDString);
     }*!/

/!*    this.route.params.subscribe((params) => {
      if (!isUndefined(params["id"])) {
        this.ligaID2 = parseInt(params["id"], 10);
        console.log('Provided Id ::::::::::', this.ligaID2);
        this.hasLigaID = true;
      }else{

      }
    });*!/

  }*/


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
    if (detailType === 'undefined') {
     return(route);
    } else {
      switch (detailType) {
        case 'verein':
          result = result + '/' + this.currentUserService.getVerein();
          break;
        default:
          if(this.ligaID2 != undefined && route.startsWith("/home")){
/*            this.route.params.subscribe((params) => {
              if (!isUndefined(params["id"])) {
                this.ligaID2 = parseInt(params["id"], 10);
                console.log('Provided Id ', this.ligaID2);
                this.hasLigaID = true;
              }else{

              }
            });*/
            //result =  result + '/'+ this.testid.toString();  //this.ligaID2
            result =  result + '/'+ this.ligaID2.toString();
          } else {
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
