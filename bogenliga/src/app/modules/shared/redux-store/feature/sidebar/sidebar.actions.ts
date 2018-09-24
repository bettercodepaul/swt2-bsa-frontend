import { Action } from '@ngrx/store';

export const TOGGLE_SIDEBAR = '[Sidebar] Show Notification';

export class ToggleSidebar implements Action {
  readonly type = TOGGLE_SIDEBAR;
}

export type SidebarActions = ToggleSidebar;
