import {NotificationState} from './feature/notification';
import {SidebarState} from './feature/sidebar';

export const NOTIFICATION_STATE = 'notificationState';
export const SIDEBAR_STATE = 'sidebarState';

export interface AppState {
  notificationState: NotificationState;
  sidebarState: SidebarState;
}
