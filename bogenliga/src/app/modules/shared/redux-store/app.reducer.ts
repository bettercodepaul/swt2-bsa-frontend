import {ActionReducerMap} from '@ngrx/store';
import {notificationReducer} from './feature/notification';
import {AppState} from './app.state';
import {sidebarReducer} from './feature/sidebar';

export const APP_REDUCERS: ActionReducerMap<AppState> = {
  notificationState: notificationReducer,
  sidebarState: sidebarReducer
};
