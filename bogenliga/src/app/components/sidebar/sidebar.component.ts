import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {AppComponent} from '../../app.component';
import {select, Store} from '@ngrx/store';
import {AppState, TOGGLE_SIDEBAR, SidebarState} from '../../modules/shared/redux-store';


@Component({
  selector: 'bla-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss',
              './../../app.component.scss']
})
export class SidebarComponent implements OnInit {

  public isActive: boolean; // for class and css to know if sidebar is wide or small

  constructor(private store: Store<AppState>) {
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
}
