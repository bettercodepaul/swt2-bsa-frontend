import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../modules/shared/redux-store';
import {TOGGLE_SIDEBAR} from '../../modules/shared/redux-store/feature/sidebar';
import {CurrentUserService} from '../../modules/shared/services/current-user';
import {UserState} from '../../modules/shared/redux-store/feature/user';
import {ButtonType} from '../../modules/shared/components/buttons';

@Component({
  selector:    'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls:   [
    './navbar.component.scss'
  ]
})
export class NavbarComponent implements OnInit {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public ButtonType = ButtonType;
  public isLoggedIn: boolean;
  public isUserDropdownVisible = false;

  constructor(private translate: TranslateService, private store: Store<AppState>, private userService: CurrentUserService) {
    store.pipe(select(state => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
    store.pipe(select(state => state.userState))
         .subscribe((state: UserState) => this.isLoggedIn = state.isLoggedIn);
  }

  ngOnInit() {

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

}
