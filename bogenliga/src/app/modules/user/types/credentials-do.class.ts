import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;
  code: string;
  twoFAenabled = false;

  constructor(username?: string, password?: string, code?: string, twoFAenabled?: boolean) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
    this.code = !!code ? code : '';
    this.twoFAenabled = twoFAenabled;
  }
}
