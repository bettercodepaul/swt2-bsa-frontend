import {Action} from '@ngrx/store';
import {UserPermission, UserSignInDTO} from '../../../services/current-user'; // kept import due to constructor in Login, has to be verified

export const LOGIN = '[User] Login';
export const LOGOUT = '[User] Logout';

export class Login implements Action {
  readonly type = LOGIN;

  constructor(public payload: UserSignInDTO) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type UserActions = Login | Logout;
