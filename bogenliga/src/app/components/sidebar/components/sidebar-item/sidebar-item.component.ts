import {Component, Input, OnInit} from '@angular/core';
import {select, Store} from '@ngrx/store';
import {AppState, SidebarState} from '../../../../modules/shared/redux-store';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';

@Component({
  selector:    'bla-sidebar-item',
  templateUrl: './sidebar-item.component.html',
  styleUrls:   [
    './sidebar-item.component.scss',
    '../../sidebar.component.scss'
  ]
})
export class SidebarItemComponent implements OnInit {
  @Input() public label: string;
  @Input() public icon: IconDefinition;

  public isActive: boolean;

  constructor(private store: Store<AppState>) {
    store.pipe(select(state => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  ngOnInit() {
  }

}
