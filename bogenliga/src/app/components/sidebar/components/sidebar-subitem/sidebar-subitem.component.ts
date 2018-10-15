import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../../../modules/shared/redux-store';

@Component({
  selector: 'bla-sidebar-subitem',
  templateUrl: './sidebar-subitem.component.html',
  styleUrls: ['./sidebar-subitem.component.scss']
})
export class SidebarSubitemComponent implements OnInit {
  @Input() public label: string;

  public isActive: boolean;

  constructor(private store: Store<AppState>) {
    store.pipe(select(state => state.sidebarState))
      .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  ngOnInit() {
  }

}
