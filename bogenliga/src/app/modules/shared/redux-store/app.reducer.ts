import {ActionReducerMap} from '@ngrx/store';
import {AppState} from './app.state';
import {notificationReducer} from './feature/notification';
import {sidebarReducer} from './feature/sidebar';
import {userReducer} from './feature/user';
import { onOfflineReducer } from './feature/onoffline';

export const APP_REDUCERS: ActionReducerMap<AppState> = {
  notificationState: notificationReducer,
  sidebarState:      sidebarReducer,
  userState:         userReducer,
  onOfflineState:    onOfflineReducer,
};
