import {Component, OnInit} from '@angular/core';
import {ModalDialogOption, ModalDialogResult} from '../../modules/shared/components/modals';
import {
  Notification,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../modules/shared/services/notification';
import {NotificationState} from '../../modules/shared/redux-store/feature/notification';
import {ButtonSize} from '../../modules/shared/components/buttons';
import {TranslatePipe} from '@ngx-translate/core';
import {isNullOrUndefined} from 'util';

@Component({
  selector:    'bla-notification',
  templateUrl: './notification.component.html',
  styleUrls:   ['./notification.component.scss'],
  providers:   [TranslatePipe]
})
export class NotificationComponent implements OnInit {

  public notification: Notification = new Notification();
  public showDialog = false;

  public ModalDialogOption = ModalDialogOption;
  public NotificationType = NotificationType;
  public ButtonSize = ButtonSize;

  constructor(private notificationService: NotificationService, private translatePipe: TranslatePipe) {
    this.notificationService.observeNotifications().subscribe((state: NotificationState) => {
      this.showDialog = state.showNotification;
      this.notification = state.notification;
    });
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

  public showRaw(): void {
    const windowWithRawData = window.open('#');
    windowWithRawData.document.write(this.notification.details);
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
      this.notificationService.updateNotification(NotificationUserAction.ACCEPTED);

    } else {
      this.notificationService.updateNotification(NotificationUserAction.DECLINED);

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

  public getDescription(): string {
    let translated = this.translatePipe.transform(this.notification.description);

    if (!isNullOrUndefined(this.notification.descriptionParam)) {
      translated = translated.replace('%s', this.notification.descriptionParam);
    }

    return translated;
  }
}
