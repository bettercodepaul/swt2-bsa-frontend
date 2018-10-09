import {Notification} from '../../../services/notification';

export interface NotificationState {
  showNotification: boolean;
  notification: Notification;
}
