import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType
} from './components/notification/types';
import {NotificationUserAction} from './components/notification/types/notification-user-action.enum';
import {select, Store} from "@ngrx/store";
import {AppState, SidebarState} from "./modules/shared/redux-store";

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  public isActive: boolean;

  public notification: Notification = {
    title: 'Title',
    description: 'Description',
    severity: NotificationSeverity.QUESTION,
    origin: NotificationOrigin.SYSTEM,
    type: NotificationType.OK_CANCEL,
    userAction: NotificationUserAction.PENDING
  };
  constructor(private translate: TranslateService, private store: Store<AppState>) {
    translate.setDefaultLang('de');
    store.pipe(select('sidebarState')).subscribe((state: SidebarState) => this.isActive = state.toggleSidebar );
  }
}


