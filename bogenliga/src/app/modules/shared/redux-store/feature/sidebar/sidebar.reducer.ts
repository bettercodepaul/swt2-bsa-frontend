import {SidebarState} from './sidebar.state';
import * as Actions from './sidebar.actions';
import {NotificationUserAction} from '../../../../../components/notification/types/notification-user-action.enum';
import {Notification} from '../../../../../components/notification/types';

export const initialSidebarState: SidebarState = {
  toggleSidebar: true,
};

export function sidebarReducer(state = initialSidebarState, action: Actions.SidebarActions): SidebarState {
  let newState: SidebarState;

  switch (action.type) {
    case Actions.TOGGLE_SIDEBAR: {
      newState = {
        ...state,
        toggleSidebar: !state.toggleSidebar
      };
      break;
    }
    default:
      // do nothing
      return state;
  }
  console.log('REDUX [SidebarReducer] ' + action.type + ' with new state ' + JSON.stringify(newState));
  return newState;
}
