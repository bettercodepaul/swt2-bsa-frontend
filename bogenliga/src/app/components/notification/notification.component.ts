import {Component, OnInit} from '@angular/core';
import {Notification, NotificationOrigin, NotificationSeverity, NotificationType} from './types';
import {select, Store} from '@ngrx/store';
import {
  ACCEPT_NOTIFICATION,
  AppState,
  DECLINE_NOTIFICATION,
  NOTIFICATION_STATE,
  NotificationState,
  ShowNotification
} from '../../modules/shared/redux-store';
import {ModalDialogOption, ModalDialogResult} from '../../modules/shared/components/modals';
import {NotificationUserAction} from './types/notification-user-action.enum';

@Component({
  selector: 'bla-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  public notification: Notification = new Notification();
  public showDialog = false;

  public ModalDialogOption = ModalDialogOption;
  public NotificationType = NotificationType;

  constructor(private store: Store<AppState>) {
    this.observeNewNotifications(store);
  }


  ngOnInit() {
  }

  /**
   * I return the icon identifier for a given notification severity.
   *
   * @return string with icon identifier
   */
  public getModalDialogHeadingIconClass(): string {
    let alertHeadingClass = 'fa-info-circle';
    switch (this.notification.severity) {
      case NotificationSeverity.QUESTION:
        alertHeadingClass = 'fa-question-circle';
        break;
      case NotificationSeverity.ERROR:
        alertHeadingClass = 'fa-exclamation-circle';
        break;
      // default
      case NotificationSeverity.INFO:
      default:
        alertHeadingClass = 'fa-info-circle';
    }

    return alertHeadingClass;
  }

  /**
   * I handle the user´s choice
   *
   * The user can press positive or negative option buttons
   *
   * @param $event of {@code ModalDialogResult}
   */
  public modalDialogResult($event: ModalDialogResult): void {
    if ($event === ModalDialogResult.OK || $event === ModalDialogResult.YES) {
      this.store.dispatch({type: ACCEPT_NOTIFICATION});

    } else {
      this.store.dispatch({type: DECLINE_NOTIFICATION});
    }
  }

  /**
   * I map the {@code NotificationType} to a {@code ModalDialogOption}
   *
   * @return {@code ModalDialogOption}
   */
  public getModalDialogOption(): ModalDialogOption {
    return ModalDialogOption[NotificationType[this.notification.type]];
  }

  public showNotification() {

    const notification: Notification = {
      id: 'identifier',
      title: 'Title',
      description: 'Description',
      severity: NotificationSeverity.ERROR,
      origin: NotificationOrigin.SYSTEM,
      type: NotificationType.OK,
      userAction: NotificationUserAction.PENDING
    };

    this.store.dispatch(new ShowNotification(notification));
  }

  /**
   * I select the {@code NOTIFICATION_STATE} of the application redux state and map the values to local copies.
   *
   * @param store implementation
   */
  private observeNewNotifications(store: Store<AppState>) {
    store.pipe(select(NOTIFICATION_STATE)).subscribe((state: NotificationState) => {
      this.showDialog = state.showNotification;
      this.notification = state.notification;
    });
  }
}
