import { Action } from '@ngrx/store';

export const SHOW_SIDEBAR = '[Sidebar] Show Notification';

export class ShowSidebar implements Action {
  readonly type = SHOW_SIDEBAR;
}

export type SidebarActions = ShowSidebar;
