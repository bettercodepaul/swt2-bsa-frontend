import {UserSignInDTO} from '../../../services/current-user';

export interface UserState {
  isLoggedIn: boolean;
  isDefaultUserLoggedIn: boolean;
  user: UserSignInDTO;
}
