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

  public isActive: boolean;

  constructor(private store: Store<AppState>) {
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
  }

  ngOnInit() {
  }

  public toggleSidebar() {
    this.store.dispatch({ type: TOGGLE_SIDEBAR });
  }
}
