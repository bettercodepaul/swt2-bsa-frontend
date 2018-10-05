import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../../../modules/shared/redux-store';

@Component({
  selector: 'bla-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls: ['./sidebar-item.component.scss',
              '../../sidebar.component.scss']
})
export class SidebarItemComponent implements OnInit {
  @Input() public label: string;
  @Input() public icon: string;

  public isActive: boolean;

  constructor(private store: Store<AppState>) {
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
  }

  ngOnInit() {
  }

}
