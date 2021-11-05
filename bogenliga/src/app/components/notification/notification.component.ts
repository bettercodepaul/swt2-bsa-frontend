import {Component, OnInit} from '@angular/core';
import {TranslatePipe} from '@ngx-translate/core';
import {ButtonSize} from '@shared/components';
import {isNullOrUndefined} from '@shared/functions';
import {NotificationState} from '@shared/redux-store';
import {
  ModalDialogOption,
  ModalDialogResult,
  Notification,
  NotificationService,
  NotificationSeverity,
  NotificationType,
  NotificationUserAction
} from '../../modules/shared';

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
  public toggleOn = false;

  constructor(private notificationService: NotificationService, private translatePipe: TranslatePipe) {
    this.notificationService.observeNotifications().subscribe((state: NotificationState) => {
      this.showDialog = state.showNotification;
      this.notification = isNullOrUndefined(state.notification) ? new Notification() : state.notification;
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
    let alertHeadingClass = 'info-circle';
    switch (this.notification.severity) {
      case NotificationSeverity.QUESTION:
        alertHeadingClass = 'question-circle';
        break;
      case NotificationSeverity.ERROR:
        alertHeadingClass = 'exclamation-circle';
        break;
      // default
      case NotificationSeverity.INFO:
      default:
        alertHeadingClass = 'info-circle';
    }

    return alertHeadingClass;
  }

  public showRaw(): void {
    const windowWithRawData = window.open('#');
    windowWithRawData.document.write(this.notification.details);
  }

  public toggleDetails(): void {
    if (this.toggleOn) {
      this.toggleOn = false;
    } else {
      this.toggleOn = true;
    }
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
