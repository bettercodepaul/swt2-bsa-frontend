import {NotificationState} from './feature/notification';
import {SidebarState} from './feature/sidebar';

export interface AppState {
  notificationState: NotificationState;
  sidebarState: SidebarState;
}
