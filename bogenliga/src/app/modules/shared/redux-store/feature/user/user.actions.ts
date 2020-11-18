import {Action} from '@ngrx/store';
import {UserSignInDTO} from '@shared/services';

export const LOGIN_AS_SPECIFIC = '[User] Login as an explicit user';
export const LOGOUT = '[User] Logout';
export const LOGIN_AS_DEFAULT = '[User] Login as Default';

export class Login implements Action {
  readonly type = this.isDefault ? LOGIN_AS_DEFAULT : LOGIN_AS_SPECIFIC;

  constructor(public payload: UserSignInDTO, public isDefault: boolean) {
  }
}

export class Logout implements Action {
  readonly type = LOGOUT;
}

export type UserActions = Login | Logout ;
