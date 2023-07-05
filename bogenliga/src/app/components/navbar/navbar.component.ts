import {Component, OnInit, DoCheck} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {TranslateService} from '@ngx-translate/core';
import {ButtonType} from '@shared/components';
import {TOGGLE_SIDEBAR} from '@shared/redux-store';
import {UserState} from '@shared/redux-store';
import {CurrentUserService, OnOfflineService} from '@shared/services';
import {AppState, SidebarState} from '../../modules/shared/redux-store';

import {BogenligaResponse} from '@shared/data-provider';
import {LigaDO} from '@verwaltung/types/liga-do.class';
import {ActivatedRoute, NavigationStart} from '@angular/router';
import {LigaDataProviderService} from '@verwaltung/services/liga-data-provider.service';
import {isUndefined} from '@shared/functions';
import {ligaID} from '../sidebar/sidebar.component'
import {SelectedLigaDataprovider} from '@shared/data-provider/SelectedLigaDataprovider';

const ID_PATH_PARAM = 'id';


@Component({
  selector:    'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls:   [
    './navbar.component.scss'
  ]
})
export class NavbarComponent implements OnInit, DoCheck {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public ButtonType = ButtonType;
  public isLoggedIn: boolean;
  public isDefaultUserLoggedIn: boolean;
  public isUserDropdownVisible = false;

  public ligaName: string = '';

  public providedID: number;
  public hasID: boolean;

  constructor(private translate: TranslateService, private store: Store<AppState>, private userService: CurrentUserService, private onOfflineService: OnOfflineService, private route: ActivatedRoute, private ligaDataProvider: LigaDataProviderService, private selectedLigaDataprovider: SelectedLigaDataprovider) {
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
    store.pipe(select((state) => state.userState))
      .subscribe((state: UserState) => this.isLoggedIn = state.isLoggedIn);
    store.pipe(select((state) => state.userState))
      .subscribe((state: UserState) => this.isDefaultUserLoggedIn = state.isDefaultUserLoggedIn);
  }

  ngOnInit() {

  }

  ngDoCheck () {
    this.providedID = this.selectedLigaDataprovider.getSelectedLigaID();
    console.log("Id ==============", this.providedID)


      if (this.providedID) {
        this.hasID = true;

      } else {
        this.hasID = false;
      }



    /*this.routeSubscription = this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {


      }

    });*/

    this.hasID ? this.loadLigaName(this.providedID) : null;
  }

  /**
   * Changes the language used on the Website
   * @param language
   */
  public useLanguage(language: string) {
    this.translate.use(language);
  }

  /**
   * tells store that sidebar button was used -> Sidebar needs to change
   */
  public toggleNavbar() {
    this.store.dispatch({type: TOGGLE_SIDEBAR});
  }

  public toggleUserDropdown(): void {
    this.isUserDropdownVisible = !this.isUserDropdownVisible;
  }

  public isOffline(): Boolean {
    return this.onOfflineService.isOffline();
  }


private async loadLigaName(ligaID: number) {
  await this.ligaDataProvider.findById(this.providedID)
.then((response: BogenligaResponse<LigaDO>) => this.setLigaName(response))
.catch()
}
  private setLigaName(response: BogenligaResponse<LigaDO>) : void {
    if(this.providedID) {
      this.ligaName = response.payload.name;
    } else {
      this.ligaName = "";
    }
    //console.log("Liga name = " + this.ligaName)
  }

  public getLigaName() : string {
    return this.ligaName;
  }

  static toggleColor(): void{
    const navbar = document.getElementById("navbar");
    navbar.style.backgroundColor = "#b2b2b2";
    navbar.style.pointerEvents = "none";
  }
  static toggleColorAgain(): void{
    const navbar = document.getElementById("navbar");
    navbar.style.backgroundColor = "#ffffff";
    navbar.style.pointerEvents = "auto";

  }

}

