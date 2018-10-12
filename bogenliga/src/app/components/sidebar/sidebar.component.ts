import {Component, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState, TOGGLE_SIDEBAR} from '../../modules/shared/redux-store';
import {SIDE_BAR_CONFIG} from './sidebar.config';
import {CurrentUserService, UserPermission} from '../../modules/shared/services/current-user';

import {faAngleDoubleRight, faAngleDoubleLeft} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss',
              './../../app.component.scss']
})
export class SidebarComponent implements OnInit {

  faAngleDoubleLeft = faAngleDoubleLeft;
  faAngleDoubleRight = faAngleDoubleRight;



  public isActive: boolean; // for class and css to know if sidebar is wide or small
  public CONFIG = SIDE_BAR_CONFIG;

  switch = this.isActive ? 'faAngleDoubleRight' : 'faAngleDoubleLeft';

  constructor(private store: Store<AppState>, private currentUserService: CurrentUserService ) {
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
  }

  ngOnInit() {
  }

  /**
   * tells store that sidebar button was used -> Sidebar needs to change
   */
  public toggleSidebar() {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }

  public hasUserPermissions(userPermissions: UserPermission[]): boolean {
    return this.currentUserService.hasAnyPermisson(userPermissions);
  }
}
