import {Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import {AppComponent} from '../../app.component';
import {TranslateService} from '@ngx-translate/core';
import {ACCEPT_NOTIFICATION} from '../../modules/shared/redux-store/feature/notification';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../modules/shared/redux-store';
import {TOGGLE_SIDEBAR} from '../../modules/shared/redux-store/feature/sidebar';

@Component({
  selector: 'bla-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss',
              './../../app.component.scss']
})
export class NavbarComponent implements OnInit {

  public isActive: boolean; // for class and css to know if sidebar is wide or small

  constructor(private translate: TranslateService, private store: Store<AppState>) {
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
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
}
