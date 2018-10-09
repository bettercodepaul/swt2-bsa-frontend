import {NotificationState} from './feature/notification';
import {SidebarState} from './feature/sidebar';
import {UserState} from './feature/user';

export const NOTIFICATION_STATE = 'notificationState';
export const SIDEBAR_STATE = 'sidebarState';

export interface AppState {
  notificationState: NotificationState;
  sidebarState: SidebarState;
  userState: UserState;
}
