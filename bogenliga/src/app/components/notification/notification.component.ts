import {Component, Input, OnInit} from '@angular/core';
import {Notification, NotificationSeverity, NotificationType} from './types';

@Component({
  selector: 'bla-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  @Input() public notification: Notification;

  public NotificationType = NotificationType;

  constructor() { }

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
}
