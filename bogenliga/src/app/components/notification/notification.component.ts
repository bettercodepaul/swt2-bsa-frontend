import {Component, Input, OnInit} from '@angular/core';
import {Notification, NotificationSeverity, NotificationType} from './types';
import {select, Store} from '@ngrx/store';
import {
  ACCEPT_NOTIFICATION,
  AppState,
  DECLINE_NOTIFICATION,
  SHOW_NOTIFICATION
} from '../../modules/shared/redux-store';

@Component({
  selector: 'bla-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() public notification: Notification;

  public notificationId = 'notification';
  public visible = false;

  public NotificationType = NotificationType;

  constructor(private store: Store<AppState>) {
    store.pipe(select('notificationState'));
  }

  ngOnInit() {
  }

  /**
   * I return the icon identifier for a given notification severity.
   *
   * @param severity of the notification
   * @return string with material icon identifier
   */
  public resolveIcon(severity: NotificationSeverity): string {
    switch (severity) {
      case NotificationSeverity.QUESTION:
        return 'help';
      case NotificationSeverity.ERROR:
        return 'error_outline';
      case NotificationSeverity.INFO:
      default:
        return '';
    }
  }


  public showNotification() {
    this.store.dispatch({ type: SHOW_NOTIFICATION });
  }
  public declineNotification(event: any) {
    // TODO detect backdrop

    if (!!event) {
      const target = event.target || event.srcElement || event.currentTarget;

      if (!!target) {
        const idAttr = target.attributes.id;

        console.log(idAttr);

        if (!idAttr) {
          this.store.dispatch({type: DECLINE_NOTIFICATION});
        }
      }
    }
  }
  public acceptNotification() {
    this.store.dispatch({ type: ACCEPT_NOTIFICATION });
  }
}
