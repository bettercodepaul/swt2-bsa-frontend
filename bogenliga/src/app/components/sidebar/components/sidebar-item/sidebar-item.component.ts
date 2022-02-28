import {Component, Input, OnInit} from '@angular/core';
import {IconDefinition} from '@fortawesome/fontawesome-common-types';
import {select, Store} from '@ngrx/store';
import {CurrentUserService} from '@shared/services';
import {AppState, SidebarState} from '../../../../modules/shared/redux-store';
import {SideBarNavigationSubitem} from '../../types/sidebar-navigation-subitem.interface';

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
  @Input() public subitems: SideBarNavigationSubitem[];

  public isActive: boolean;




  constructor(private store: Store<AppState>,  private currentUserService: CurrentUserService) {
    store.pipe(select((state) => state.sidebarState))
         .subscribe((state: SidebarState) => this.isActive = state.toggleSidebar);
  }

  ngOnInit() {
  }
}
