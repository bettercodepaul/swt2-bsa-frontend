import {NotificationOrigin} from './notification-origin.enum';
import {NotificationType} from './notification-type.enum';
import {NotificationSeverity} from './notification-severity.enum';
import {NotificationUserAction} from './notification-user-action.enum';

export class Notification {
  public id: string;
  public title: string;
  public description: string;
  public details?: string;
  public severity: NotificationSeverity = NotificationSeverity.INFO;
  public origin: NotificationOrigin = NotificationOrigin.SYSTEM;
  public type?: NotificationType = NotificationType.OK;
  public userAction?: NotificationUserAction = NotificationUserAction.PENDING;
}
