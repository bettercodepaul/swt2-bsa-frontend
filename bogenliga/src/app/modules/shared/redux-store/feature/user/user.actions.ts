import {Action} from '@ngrx/store';
import {UserSignInDTO} from '../../../services/current-user';

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
