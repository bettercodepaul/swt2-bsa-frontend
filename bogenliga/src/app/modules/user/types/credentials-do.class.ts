import {DataObject} from '../../shared/data-provider';

export class CredentialsDO implements DataObject {
  username: string;
  password: string;
  rememberMe = false;
  code: string;
  using2FA = false;

  constructor(username?: string, password?: string, code?: string, using2FA?: boolean) {
    this.username = !!username ? username : '';
    this.password = !!password ? password : '';
    this.code = !!code ? code : '';
    this.using2FA = using2FA;
  }
}
