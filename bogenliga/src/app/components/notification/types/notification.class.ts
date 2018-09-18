import {NotificationOrigin} from './notification-origin.enum';
import {NotificationType} from './notification-type.enum';
import {NotificationSeverity} from './notification-severity.enum';

export class Notification {
  public title: string;
  public description: string;
  public severity: NotificationSeverity = NotificationSeverity.INFO;
  public origin: NotificationOrigin = NotificationOrigin.SYSTEM;
  public type?: NotificationType = NotificationType.OK;
}
