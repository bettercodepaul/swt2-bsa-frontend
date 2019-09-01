import * as Actions from './user.actions';
import {UserState} from './user.state';

export const initialUserState: UserState = {
  isLoggedIn: false,
  isDefaultUserLoggedIn: true,
  user:       null
};

export function userReducer(state = initialUserState, action: Actions.UserActions): UserState {
  let newState: UserState;

  switch (action.type) {
    case Actions.LOGIN: {
      newState = {
        ...state,
        user:       action.payload,
        isLoggedIn: true
      };
      break;
    }
    case Actions.LOGOUT: {
      newState = {
        ...state,
        user:       null,
        isLoggedIn: false
      };
      break;
    }
    default:
      // do nothing
      return state;
  }
  console.log('REDUX [UserReducer] ' + action.type + ' with new state ' + JSON.stringify(newState));
  return newState;
}
