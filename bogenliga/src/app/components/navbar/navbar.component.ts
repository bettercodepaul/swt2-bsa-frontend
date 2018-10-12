import {Component, OnInit} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../modules/shared/redux-store';
import {TOGGLE_SIDEBAR} from '../../modules/shared/redux-store/feature/sidebar';
import {CurrentUserService} from '../../modules/shared/services/current-user';
import {LOGOUT, UserState} from '../../modules/shared/redux-store/feature/user';
import {ButtonType} from "../../modules/shared/components/buttons";

import { faBars  } from '@fortawesome/free-solid-svg-icons';
import { faUserCircle  } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss',
              './../../app.component.scss']
})
export class NavbarComponent implements OnInit {

  public isActive: boolean; // for class and css to know if sidebar is wide or small
  private isLoggedIn: boolean;
  public ButtonType = ButtonType;

  faBars = faBars;
  faUserCircle = faUserCircle;

  constructor(private translate: TranslateService, private store: Store<AppState>, private userService: CurrentUserService) {
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
    store.pipe(select('userState')).subscribe((state: UserState) => this.isLoggedIn = state.isLoggedIn );
  }

  ngOnInit() {

  }

  /**
   * Changes the language used on the Website
   * @param language
   */
  useLanguage(language: string) {
    this.translate.use(language);
  }

  /**
   * tells store that sidebar button was used -> Sidebar needs to change
   */
  public toggleNavbar() {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }

  public logout() {
    this.store.dispatch({ type: LOGOUT, user: null });
    this.userService.logout();
  }
}
