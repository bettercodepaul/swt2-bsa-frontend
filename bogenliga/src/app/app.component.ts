import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {
  Notification,
  NotificationOrigin,
  NotificationSeverity,
  NotificationType
} from './components/notification/types';
import {NotificationUserAction} from './components/notification/types/notification-user-action.enum';

@Component({
  selector: 'bla-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'bla';
  open =  '';

  public notification: Notification = {
    title: 'Title',
    description: 'Description',
    severity: NotificationSeverity.QUESTION,
    origin: NotificationOrigin.SYSTEM,
    type: NotificationType.OK_CANCEL,
    userAction: NotificationUserAction.PENDING
  };
  constructor(private translate: TranslateService) {
    translate.setDefaultLang('de');
  }

  public isActive = true;

  public toggle(): void {
    this.isActive = !this.isActive;
  }

}


