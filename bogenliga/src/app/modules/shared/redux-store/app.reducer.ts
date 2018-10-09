import {ActionReducerMap} from '@ngrx/store';
import {notificationReducer} from './feature/notification';
import {AppState} from './app.state';
import {sidebarReducer} from './feature/sidebar';
import {userReducer} from './feature/user';

export const APP_REDUCERS: ActionReducerMap<AppState> = {
  notificationState: notificationReducer,
  sidebarState: sidebarReducer,
  userState: userReducer,
};
